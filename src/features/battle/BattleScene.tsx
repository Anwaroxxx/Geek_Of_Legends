// ============================================
// BATTLE SCENE — Main combat screen with real sprites
// ============================================
import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { useHeroStore } from '../../store/heroStore';
import { useBattleStore } from '../../store/battleStore';
import {
  resolveHeroAttack, resolveBossAttack, pickBossSkill,
  shouldAdvancePhase, shouldTriggerRiddle, processDotEffects,
  tickStatusEffects, isIncapacitated, getArenaHazard,
} from '../../core/combat/CombatEngine';
import BattleHUD from './BattleHUD';
import SkillBar from './SkillBar';
import BossHealthBar from './BossHealth';
import BossIntro from './BossIntro';
import FloatingDamage from './FloatingDamage';
import CombatLogPanel from './CombatLogPanel';
import SpriteAnimator from '../../rendering/animation/SpriteAnimator';
import { CHARACTER_SPRITES } from '../../rendering/animation/SpriteConfig';
import type { Skill, HeroData } from '../../types/Game';
import type { SpriteAnimation } from '../../rendering/animation/SpriteConfig';
import { BOSS_COLORS } from '../../constants/balance';
import VFXManager, { useVFX } from './VFXManager';
import SpeechBubble from './SpeechBubble';

export default function BattleScene() {
  const { currentBossId, setPhase, markBossDefeated, defeatedBosses } = useGameStore();
  const heroes = useHeroStore((s) => s.heroes);
  const { damageHero, healHero, spendMp, addRage, spendArrow, putSkillOnCooldown, tickCooldowns } = useHeroStore();
  const {
    boss, initBoss, damageBoss, healBoss,
    isPlayerTurn, isBossTurn, isAnimating,
    setPlayerTurn, setBossTurn, setAnimating,
    setCurrentTurnHero, currentTurnHeroId, turnCount,
    advanceTurn, addCombatLog, addFloatingText, floatingTexts,
    removeFloatingText, advanceBossPhase,
    momentum, addMomentum, eclipseState, setEclipseState,
  } = useBattleStore();

  const [showBossIntro, setShowBossIntro] = useState(true);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [shaking, setShaking] = useState(false);
  const [bossAnim, setBossAnim] = useState<SpriteAnimation>('idle');
  const [heroAnims, setHeroAnims] = useState<Record<string, SpriteAnimation>>({});
  const [heroHurtStates, setHeroHurtStates] = useState<Record<string, boolean>>({});
  const [bossHurtState, setBossHurtState] = useState(false);
  const [phaseWarning, setPhaseWarning] = useState<string | null>(null);
  
  const [speech, setSpeech] = useState<{ text: string, x: number, y: number, color: string } | null>(null);

  const { effects, spawnVFX } = useVFX();

  useEffect(() => {
    initBoss(currentBossId);
    const t = setTimeout(() => setShowBossIntro(false), 3500);
    return () => clearTimeout(t);
  }, [currentBossId, initBoss]);

  useEffect(() => {
    if (!showBossIntro && heroes.length > 0) {
      const alive = heroes.filter((h) => h.isAlive);
      if (alive.length > 0) {
        setCurrentTurnHero(alive[0].id);
        setCurrentHeroIndex(0);
        setPlayerTurn(true);
      }
      // Init all hero anims to idle
      const anims: Record<string, SpriteAnimation> = {};
      const hurt: Record<string, boolean> = {};
      heroes.forEach((h) => { 
        anims[h.id] = 'idle'; 
        hurt[h.id] = false;
      });
      setHeroAnims(anims);
      setHeroHurtStates(hurt);
      
      triggerSpeech("Let's end this!", 150, 250, '#c5a059');
    }
  }, [showBossIntro]);

  const triggerShake = useCallback(() => {
    setShaking(true);
    setTimeout(() => setShaking(false), 500);
  }, []);

  const triggerSpeech = (text: string, x: number, y: number, color: string) => {
    setSpeech({ text, x, y, color });
    setTimeout(() => setSpeech(null), 3000);
  };

  useEffect(() => {
    if (floatingTexts.length === 0) return;
    const timer = setTimeout(() => {
      floatingTexts.forEach((ft) => removeFloatingText(ft.id));
    }, 1500);
    return () => clearTimeout(timer);
  }, [floatingTexts, removeFloatingText]);

  useEffect(() => {
    if (!boss || showBossIntro) return;
    if (!boss.isAlive) {
      setTimeout(() => {
        markBossDefeated(boss.id);
        useHeroStore.getState().resetForBattle();
        
        // Check if all 3 bosses are defeated (Lilith, Sauron, Chronos)
        const updatedDefeated = useGameStore.getState().defeatedBosses;
        const allDefeated = ['sauron', 'chronos', 'lilith'].every(id => 
          updatedDefeated.includes(id as any) || id === boss.id
        );

        if (allDefeated) {
          setPhase('grand-victory');
        } else {
          setPhase('victory');
        }
      }, 1500);
      return;
    }
    const allDead = heroes.every((h) => !h.isAlive);
    if (allDead) {
      setTimeout(() => setPhase('death'), 1500);
    }
  }, [boss, heroes, showBossIntro, setPhase]);

  const handleUseSkill = useCallback((skill: Skill) => {
    if (!boss || !isPlayerTurn || isAnimating) return;
    const hero = heroes.find((h) => h.id === currentTurnHeroId);
    if (!hero || !hero.isAlive) return;

    if (skill.mpCost > hero.stats.mp) {
      addCombatLog({ turn: turnCount, message: `${hero.name} doesn't have enough MP!`, type: 'system' });
      return;
    }
    if (skill.rageCost && hero.rage !== undefined && skill.rageCost > hero.rage) {
      addCombatLog({ turn: turnCount, message: `${hero.name} doesn't have enough Rage!`, type: 'system' });
      return;
    }
    if (skill.arrowCost && hero.arrows !== undefined && skill.arrowCost > hero.arrows) {
      addCombatLog({ turn: turnCount, message: `${hero.name} is out of arrows!`, type: 'system' });
      return;
    }
    if (skill.currentCooldown > 0) {
      addCombatLog({ turn: turnCount, message: `${skill.name} is on cooldown!`, type: 'system' });
      return;
    }

    setAnimating(true);

    // Play hero attack animation
    const attackAnim: SpriteAnimation =
      skill.type === 'buff' ? 'cast'
      : hero.heroClass === 'mage' ? 'cast'
      : hero.heroClass === 'archer' ? 'shoot'
      : 'attack';
    setHeroAnims((prev) => ({ ...prev, [hero.id]: attackAnim }));

    if (skill.mpCost > 0) spendMp(hero.id, skill.mpCost);
    if (skill.rageCost && skill.rageCost > 0) addRage(hero.id, -skill.rageCost);
    if (skill.arrowCost) spendArrow(hero.id, skill.arrowCost);
    if (skill.cooldown > 0) putSkillOnCooldown(hero.id, skill.id);

    setTimeout(() => {
      if (skill.type === 'buff') {
        addCombatLog({ turn: turnCount, message: `${hero.name} uses ${skill.name}!`, type: 'buff' });
        addFloatingText({ text: skill.name, type: 'heal', x: 200, y: 280 });
        spawnVFX('buff', 200, 300);
      } else {
        const result = resolveHeroAttack(hero, boss, skill);

        // Boss hurt animation
        setBossAnim('hurt');
        setBossHurtState(true);
        setTimeout(() => {
          setBossAnim('idle');
          setBossHurtState(false);
        }, 600);

        if (result.isDodged) {
          addCombatLog({ turn: turnCount, message: `${hero.name}'s ${skill.name} missed!`, type: 'miss' });
        } else {
          damageBoss(result.damage);
          if (hero.heroClass === 'warrior') addRage(hero.id, 15);
          addMomentum(result.isCrit ? 15 : 5);
          
          addCombatLog({
            turn: turnCount,
            message: `${hero.name} hits ${boss.name} with ${skill.name} for ${result.damage}${result.isCrit ? ' CRIT!' : ''}`,
            type: result.isCrit ? 'crit' : 'damage',
            value: result.damage,
          });
          if (result.isCrit) triggerShake();
          
          // Spawn VFX based on skill/class
          const vfxType = skill.damageType === 'fire' ? 'fire' : 'slash';
          spawnVFX(vfxType, result.floatingText.x, result.floatingText.y);
          spawnVFX('hit', result.floatingText.x, result.floatingText.y);
        }
        addFloatingText(result.floatingText);

        const updatedBoss = useBattleStore.getState().boss;
        if (updatedBoss && shouldAdvancePhase(updatedBoss)) {
          advanceBossPhase();
          const newPhase = updatedBoss.phases[updatedBoss.currentPhase];
          if (newPhase) {
            setPhaseWarning(newPhase.name);
            setTimeout(() => setPhaseWarning(null), 2000);
            addCombatLog({ turn: turnCount, message: `${boss.name} enters phase: ${newPhase.name}!`, type: 'phase' });
            
            if (newPhase.aura === 'eclipse') {
              setEclipseState(true);
              triggerSpeech("Darkness take you!", 600, 200, '#ef4444');
            }
          }
        }
      }

      // Return hero to idle
      setTimeout(() => {
        setHeroAnims((prev) => ({ ...prev, [hero.id]: 'idle' }));
      }, 400);

      setTimeout(() => {
        setAnimating(false);
        const aliveHeroes = useHeroStore.getState().heroes.filter((h) => h.isAlive);
        const currentIndex = aliveHeroes.findIndex(h => h.id === currentTurnHeroId);
        const nextIndex = currentIndex + 1;

        if (nextIndex < aliveHeroes.length && nextIndex > 0) {
          setCurrentHeroIndex(nextIndex);
          setCurrentTurnHero(aliveHeroes[nextIndex].id);
        } else {
          setPlayerTurn(false);
          setBossTurn(true);
          executeBossTurn();
        }
      }, 600);
    }, 500);
  }, [boss, isPlayerTurn, isAnimating, heroes, currentTurnHeroId, turnCount, spawnVFX, addMomentum]);

  const handlePassTurn = useCallback(() => {
    if (!boss || !isPlayerTurn || isAnimating) return;
    const hero = heroes.find((h) => h.id === currentTurnHeroId);
    if (!hero || !hero.isAlive) return;

    setAnimating(true);
    addCombatLog({ turn: turnCount, message: `${hero.name} passes their turn and recovers some resources.`, type: 'system' });
    addFloatingText({ text: 'Pass', type: 'system', x: 200, y: 280 });

    // Recover small amount of resources
    if (hero.heroClass === 'mage') spendMp(hero.id, -20);
    if (hero.heroClass === 'warrior') addRage(hero.id, 20);
    if (hero.heroClass === 'archer') {
      spendArrow(hero.id, -5);
    }

    setTimeout(() => {
      setAnimating(false);
      const aliveHeroes = useHeroStore.getState().heroes.filter((h) => h.isAlive);
      const currentIndex = aliveHeroes.findIndex(h => h.id === currentTurnHeroId);
      const nextIndex = currentIndex + 1;

      if (nextIndex < aliveHeroes.length && nextIndex > 0) {
        setCurrentHeroIndex(nextIndex);
        setCurrentTurnHero(aliveHeroes[nextIndex].id);
      } else {
        setPlayerTurn(false);
        setBossTurn(true);
        executeBossTurn();
      }
    }, 600);
  }, [boss, isPlayerTurn, isAnimating, heroes, currentTurnHeroId, turnCount]);

  const executeBossTurn = useCallback(() => {
    const currentBoss = useBattleStore.getState().boss;
    if (!currentBoss || !currentBoss.isAlive) return;

    setAnimating(true);
    
    // Process Arena Hazards
    const hazard = getArenaHazard(currentBoss.arena, turnCount);
    if (hazard) {
      addCombatLog({ turn: turnCount, message: hazard.message, type: 'system' });
      if (hazard.target === 'all') {
        heroes.forEach(h => {
          if (h.isAlive) damageHero(h.id, hazard.damage);
        });
        triggerShake();
      }
    }

    const skill = pickBossSkill(currentBoss);

    // Boss attack animation
    setBossAnim('attack');
    addCombatLog({ turn: turnCount, message: `${currentBoss.name} prepares ${skill.name}...`, type: 'system' });

    setTimeout(() => {
      setBossAnim('idle');
      const aliveHeroes = useHeroStore.getState().heroes.filter((h) => h.isAlive);
      if (aliveHeroes.length === 0) return;

      if (skill.type === 'heal') {
        const healAmount = Math.floor(currentBoss.stats.maxHp * 0.08);
        healBoss(healAmount);
        addCombatLog({ turn: turnCount, message: `${currentBoss.name} heals for ${healAmount}!`, type: 'heal', value: healAmount });
        addFloatingText({ text: `+${healAmount}`, type: 'heal', x: 600, y: 180 });
        spawnVFX('heal', 600, 180);
      } else if (skill.targetAll) {
        aliveHeroes.forEach((hero, i) => {
          const result = resolveBossAttack(currentBoss, hero, skill);
          // Hero hurt animation
          setHeroAnims((prev) => ({ ...prev, [hero.id]: 'hurt' }));
          setHeroHurtStates((prev) => ({ ...prev, [hero.id]: true }));
          setTimeout(() => {
            setHeroAnims((prev) => ({ ...prev, [hero.id]: 'idle' }));
            setHeroHurtStates((prev) => ({ ...prev, [hero.id]: false }));
          }, 600);

          if (!result.isDodged) {
            damageHero(hero.id, result.damage);
            triggerShake();
            spawnVFX('hit', 80 + i * 180, 300);
          }
          addFloatingText({ ...result.floatingText, x: 80 + i * 180, y: 300 + Math.random() * 30 });
          addCombatLog({
            turn: turnCount,
            message: result.isDodged
              ? `${hero.name} dodges ${skill.name}!`
              : `${currentBoss.name}'s ${skill.name} hits ${hero.name} for ${result.damage}${result.isCrit ? ' CRIT!' : ''}`,
            type: result.isDodged ? 'miss' : result.isCrit ? 'crit' : 'damage',
            value: result.damage,
          });
        });
      } else {
        const target = aliveHeroes[Math.floor(Math.random() * aliveHeroes.length)];
        const result = resolveBossAttack(currentBoss, target, skill);
        setHeroAnims((prev) => ({ ...prev, [target.id]: 'hurt' }));
        setHeroHurtStates((prev) => ({ ...prev, [target.id]: true }));
        setTimeout(() => {
          setHeroAnims((prev) => ({ ...prev, [target.id]: 'idle' }));
          setHeroHurtStates((prev) => ({ ...prev, [target.id]: false }));
        }, 600);

        if (!result.isDodged) {
          damageHero(target.id, result.damage);
          triggerShake();
          spawnVFX('hit', result.floatingText.x, result.floatingText.y);
        }
        addFloatingText(result.floatingText);
        addCombatLog({
          turn: turnCount,
          message: result.isDodged
            ? `${target.name} dodges ${skill.name}!`
            : `${currentBoss.name}'s ${skill.name} hits ${target.name} for ${result.damage}${result.isCrit ? ' CRIT!' : ''}`,
          type: result.isDodged ? 'miss' : result.isCrit ? 'crit' : 'damage',
          value: result.damage,
        });
      }

      setTimeout(() => {
        setAnimating(false);
        setBossTurn(false);
        setPlayerTurn(true);
        advanceTurn();
        tickCooldowns();
        const newAlive = useHeroStore.getState().heroes.filter((h) => h.isAlive);
        if (newAlive.length > 0) {
          setCurrentHeroIndex(0);
          setCurrentTurnHero(newAlive[0].id);
        }
      }, 700);
    }, 1000);
  }, [turnCount, spawnVFX, heroes]);

  if (!boss) return null;

  const bossColors = BOSS_COLORS[boss.id] || BOSS_COLORS.sauron;
  const currentPhase = boss.phases[boss.currentPhase];
  const bossSprites = CHARACTER_SPRITES[boss.id];

  return (
    <div style={{
      width: '100%', height: '100%',
      position: 'relative', overflow: 'hidden',
      background: getBattleBackground(boss.arena),
      animation: shaking ? 'shake 0.5s ease-in-out' : undefined,
    }}>
      <AnimatePresence>
        {showBossIntro && <BossIntro boss={boss} />}
      </AnimatePresence>

      <ArenaParticles arena={boss.arena} />
      <VFXManager effects={effects} />
      
      {speech && <SpeechBubble {...speech} />}
      
      {/* Eclipse Overlay */}
      <AnimatePresence>
        {eclipseState && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute', inset: 0,
              background: 'black',
              zIndex: 2,
              pointerEvents: 'none',
            }}
          />
        )}
      </AnimatePresence>

      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 3,
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Ground/platform */}
      <div style={{
        position: 'absolute', bottom: 170, left: '5%', right: '5%',
        height: 4, borderRadius: 2,
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)',
        zIndex: 3,
      }} />

      {/* Phase Warning */}
      <AnimatePresence>
        {phaseWarning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="phase-warning"
            style={{ zIndex: 200 }}
          >
            <div className="phase-warning-text">{phaseWarning}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Boss HP bar */}
      <div style={{
        position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)',
        zIndex: 10, width: '90%', maxWidth: 700,
      }}>
        <BossHealthBar boss={boss} currentPhase={currentPhase} />
      </div>
      
      {/* Momentum Bar */}
      <div style={{
        position: 'absolute', top: 120, left: '50%', transform: 'translateX(-50%)',
        zIndex: 10, width: 200, height: 8, background: 'rgba(0,0,0,0.5)',
        borderRadius: 4, border: '1px solid rgba(255,255,255,0.1)',
        overflow: 'hidden',
      }}>
        <motion.div
          animate={{ width: `${momentum}%` }}
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #facc15, #eab308)',
            boxShadow: '0 0 10px #facc15',
          }}
        />
        {momentum >= 100 && (
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1 }}
            style={{
              position: 'absolute', inset: 0,
              background: 'white',
              opacity: 0.5,
            }}
          />
        )}
      </div>

      {/* Boss sprite */}
      <div style={{
        position: 'absolute',
        top: '50%', right: '15%', transform: 'translateY(-50%)',
        zIndex: 4,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        <motion.div
          animate={bossAnim === 'hurt'
            ? { x: [-8, 8, -8, 8, 0] }
            : { y: [0, -6, 0] }
          }
          transition={bossAnim === 'hurt'
            ? { duration: 0.3 }
            : { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }
          }
          style={{ position: 'relative' }}
        >
          {/* Boss aura glow */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{
              position: 'absolute',
              bottom: 0, left: '50%',
              width: 180, height: 60,
              transform: 'translate(-50%, 50%)',
              borderRadius: '50%',
              background: `radial-gradient(ellipse, ${bossColors.glow} 0%, transparent 70%)`,
              pointerEvents: 'none',
              zIndex: -1,
            }}
          />

          {bossSprites && (
            <SpriteAnimator
              spriteSet={bossSprites}
              animation={bossAnim}
              direction="left" // Make boss face left toward heroes
              scale={3.5}
              playing={true}
              loop={bossAnim === 'idle'}
              isHurt={bossHurtState}
              isAttacking={bossAnim === 'attack'}
              style={{ filter: `drop-shadow(0 20px 20px rgba(0,0,0,0.8))` }}
            />
          )}
        </motion.div>
      </div>

      {/* Hero sprites */}
      <div style={{
        position: 'absolute', top: '42%', left: '15%', transform: 'translateY(-50%)',
        display: 'flex', flexDirection: 'column', gap: 10, zIndex: 5, alignItems: 'center',
      }}>
        {heroes.map((hero, index) => {
          const spriteSet = CHARACTER_SPRITES[hero.heroClass];
          const anim = heroAnims[hero.id] || 'idle';
          const isActive = hero.id === currentTurnHeroId && isPlayerTurn;
          const isHurt = heroHurtStates[hero.id];
          
          // Heroes stacked vertically, stepping forward to the right when active
          return (
            <motion.div
              key={hero.id}
              animate={
                !hero.isAlive ? { opacity: 0.3, y: 10 }
                : isActive ? { x: [0, 150, 150] } // Step far forward (to the right)
                : { x: 0, y: 0 } // Step back
              }
              transition={
                isActive ? { duration: 0.3, ease: 'easeOut' } : { duration: 0.3 }
              }
              style={{
                textAlign: 'center', position: 'relative',
                width: 100, height: 100,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {/* Shadow / Glow under hero */}
              <motion.div
                animate={isActive ? { opacity: [0.4, 0.8, 0.4], scale: [0.9, 1.1, 0.9] } : { opacity: 0.3 }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{
                  position: 'absolute', bottom: -10,
                  left: '50%', transform: 'translateX(-50%)',
                  width: 60, height: 20,
                  borderRadius: '50%',
                  background: isActive 
                    ? `radial-gradient(ellipse, ${HERO_COLORS_MAP[hero.heroClass]} 0%, transparent 70%)`
                    : 'radial-gradient(ellipse, rgba(0,0,0,0.8) 0%, transparent 70%)',
                  pointerEvents: 'none',
                  zIndex: -1,
                }}
              />

              {spriteSet && (
                <div style={{ position: 'absolute' }}>
                  <SpriteAnimator
                    spriteSet={spriteSet}
                    animation={anim}
                    direction="right" // Heroes face right toward boss
                    scale={2} // Uniform scaling for all characters
                    playing={true}
                    loop={anim === 'idle'}
                    isHurt={isHurt}
                    isAttacking={anim === 'attack' || anim === 'shoot' || anim === 'cast'}
                    style={{ 
                      opacity: hero.isAlive ? 1 : 0.3,
                      filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.6))'
                    }}
                  />
                </div>
              )}

              <div style={{ position: 'absolute', bottom: -30, left: '50%', transform: 'translateX(-50%)' }}>
                <p style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  color: isActive ? HERO_COLORS_MAP[hero.heroClass] : '#8b7aa8',
                  whiteSpace: 'nowrap',
                  textShadow: '0 2px 4px rgba(0,0,0,0.9), 0 0 10px rgba(0,0,0,0.8)',
                  background: 'rgba(0,0,0,0.4)',
                  padding: '2px 6px',
                  borderRadius: 4,
                }}>
                  {hero.name}
                </p>
                {!hero.isAlive && (
                  <p style={{ fontSize: '0.55rem', color: '#ef4444', fontWeight: 900, textShadow: '0 2px 4px #000', margin: 0 }}>DEAD</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <FloatingDamage texts={floatingTexts} />

      {/* Bottom HUD */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 50 }}>
        <BattleHUD heroes={heroes} currentHeroId={currentTurnHeroId} turnCount={turnCount} isPlayerTurn={isPlayerTurn} />
        {isPlayerTurn && currentTurnHeroId && heroes.find((h) => h.id === currentTurnHeroId) && (
          <SkillBar
            hero={heroes.find((h) => h.id === currentTurnHeroId)!}
            onUseSkill={handleUseSkill}
            onPassTurn={handlePassTurn}
            disabled={isAnimating}
          />
        )}
      </div>

      <CombatLogPanel />

      {/* Turn indicator */}
      <div style={{
        position: 'absolute', top: 80, right: 20, zIndex: 50,
        padding: '6px 16px',
        background: 'rgba(13,10,24,0.9)',
        border: `1px solid ${isPlayerTurn ? '#c5a059' : '#ef4444'}`,
        borderRadius: 6,
        fontFamily: "'Cinzel', serif",
        fontSize: '0.75rem',
        color: isPlayerTurn ? '#c5a059' : '#ef4444',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
      }}>
        {isPlayerTurn ? 'Your Turn' : 'Boss Turn'}
      </div>
    </div>
  );
}

const HERO_COLORS_MAP: Record<string, string> = {
  warrior: 'rgba(239,68,68,0.5)',
  mage: 'rgba(139,92,246,0.5)',
  archer: 'rgba(16,185,129,0.5)',
};

function ArenaParticles({ arena }: { arena: string }) {
  const [particles] = useState(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i, x: Math.random() * 100, size: 1 + Math.random() * 3,
      delay: Math.random() * 8, duration: 4 + Math.random() * 6,
    }))
  );
  const color = arena === 'lava_temple' ? 'rgba(249,115,22,0.6)'
    : arena === 'clock_temple' ? 'rgba(56,189,248,0.4)'
    : 'rgba(168,85,247,0.4)';

  return (<>
    {particles.map((p) => (
      <div key={p.id} style={{
        position: 'absolute', left: `${p.x}%`, bottom: '-2%',
        width: `${p.size}px`, height: `${p.size}px`, borderRadius: '50%',
        background: color, boxShadow: `0 0 ${p.size * 4}px ${color}`,
        animation: `ember ${p.duration}s ease-out ${p.delay}s infinite`,
        zIndex: 2, pointerEvents: 'none',
        '--drift': `${(Math.random() - 0.5) * 80}px`,
      } as React.CSSProperties} />
    ))}
  </>);
}

function getBattleBackground(arena: string): string {
  switch (arena) {
    case 'lava_temple':
      return 'linear-gradient(180deg, #1a0505 0%, #2d0f0f 20%, #1a0808 50%, #120505 80%, #0a0303 100%)';
    case 'clock_temple':
      return 'linear-gradient(180deg, #050a1a 0%, #0a1530 20%, #081225 50%, #050d1a 80%, #030810 100%)';
    case 'void_palace':
      return 'linear-gradient(180deg, #0a0515 0%, #150a28 20%, #0d0620 50%, #080412 80%, #050308 100%)';
    default:
      return 'linear-gradient(180deg, #05030a 0%, #0d0a18 100%)';
  }
}
