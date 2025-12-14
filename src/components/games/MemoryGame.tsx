import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface MemoryGameProps {
  onBack: () => void;
}

interface Card {
  id: number;
  content: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const MemoryGame = ({ onBack }: MemoryGameProps) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  const cardContents = [
    '🇻🇳', '⭐', '🏛️', '📜', 
    '🎖️', '🔥', '✊', '🕊️'
  ];

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const duplicatedCards = [...cardContents, ...cardContents]
      .sort(() => Math.random() - 0.5)
      .map((content, index) => ({
        id: index,
        content,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(duplicatedCards);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setGameWon(false);
  };

  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2) return;
    if (flippedCards.includes(id)) return;
    if (cards[id].isMatched) return;

    const newFlippedCards = [...flippedCards, id];
    setFlippedCards(newFlippedCards);

    setCards(cards.map(card =>
      card.id === id ? { ...card, isFlipped: true } : card
    ));

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      checkMatch(newFlippedCards);
    }
  };

  const checkMatch = (flippedIds: number[]) => {
    const [first, second] = flippedIds;
    const firstCard = cards[first];
    const secondCard = cards[second];

    if (firstCard.content === secondCard.content) {
      // Match found
      setTimeout(() => {
        setCards(cards.map(card =>
          card.id === first || card.id === second
            ? { ...card, isMatched: true }
            : card
        ));
        setFlippedCards([]);
        setMatches(matches + 1);
        
        if (matches + 1 === cardContents.length) {
          setGameWon(true);
        }
      }, 500);
    } else {
      // No match
      setTimeout(() => {
        setCards(cards.map(card =>
          card.id === first || card.id === second
            ? { ...card, isFlipped: false }
            : card
        ));
        setFlippedCards([]);
      }, 1000);
    }
  };

  if (gameWon) {
    return (
      <div className="container mx-auto px-4 py-12 min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-gray-900 to-black border-2 border-gold-500 rounded-lg p-12 max-w-2xl w-full text-center"
        >
          <h2 className="text-4xl font-cinzel font-bold text-gradient mb-6">
            CHIẾN THẮNG! 🎉
          </h2>
          <div className="text-2xl text-gray-300 mb-8">
            <p>Bạn đã hoàn thành trong <span className="text-gold-400 font-bold">{moves}</span> nước đi!</p>
          </div>
          <div className="flex gap-4 justify-center">
            <button onClick={initializeGame} className="btn-primary">
              Chơi lại
            </button>
            <button onClick={onBack} className="btn-secondary">
              Quay lại
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Game Stats */}
        <div className="flex justify-between mb-8 text-xl">
          <div className="text-gold-400">
            Nước đi: <span className="font-bold">{moves}</span>
          </div>
          <div className="text-gold-400">
            Cặp đã tìm: <span className="font-bold">{matches}/{cardContents.length}</span>
          </div>
        </div>

        {/* Game Board */}
        <div className="grid grid-cols-4 gap-4">
          {cards.map((card) => (
            <motion.div
              key={card.id}
              className="aspect-square cursor-pointer perspective"
              onClick={() => handleCardClick(card.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="relative w-full h-full"
                animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Card Back */}
                <div
                  className="absolute inset-0 bg-gradient-to-br from-gold-600 to-gold-700 rounded-lg flex items-center justify-center border-2 border-gold-400 shadow-lg"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <div className="text-4xl">❓</div>
                </div>

                {/* Card Front */}
                <div
                  className={`absolute inset-0 rounded-lg flex items-center justify-center border-2 shadow-lg ${
                    card.isMatched
                      ? 'bg-gradient-to-br from-green-600 to-green-700 border-green-400'
                      : 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-600'
                  }`}
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  <div className="text-6xl">{card.content}</div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Reset Button */}
        <div className="text-center mt-8">
          <button onClick={initializeGame} className="btn-secondary">
            Chơi lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemoryGame;
