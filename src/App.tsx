// ============================================
// APP — Main game router by phase
// ============================================
import { useGameStore } from './store/gameStore';
import MainMenu from './features/menu/MainMenu';
import PartyCreation from './features/party/PartyCreation';
import BattleScene from './features/battle/BattleScene';
import RiddleScreen from './features/rewards/RiddleScreen';
import VictoryScreen from './features/rewards/VictoryScreen';
import DeathScreen from './features/rewards/DeathScreen';
import GrandVictory from './features/rewards/GrandVictory';
import './styles/globals.css';
import './styles/animations.css';
import './styles/theme.css';

function App() {
  const phase = useGameStore((s) => s.phase);

  const renderPhase = () => {
    switch (phase) {
      case 'menu':
        return <MainMenu />;
      case 'party-creation':
        return <PartyCreation />;
      case 'stat-allocation':
        return <PartyCreation />;
      case 'battle':
        return <BattleScene />;
      case 'riddle':
        return <RiddleScreen />;
      case 'victory':
        return <VictoryScreen />;
      case 'loot':
        return <VictoryScreen />;
      case 'death':
        return <DeathScreen />;
      case 'grand-victory':
        return <GrandVictory />;
      default:
        return <MainMenu />;
    }
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      background: '#05030a',
      position: 'relative',
    }}>
      {renderPhase()}
    </div>
  );
}

export default App;
