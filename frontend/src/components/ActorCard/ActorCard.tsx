import { Cast } from '../../types/prisma';

const ActorCard = ({ actor }: { actor: Cast }) => {
  return (
    <div className="flex flex-col items-center w-36">
      <img 
        src={actor.profilePath || ''} 
        alt={actor.name} 
        className="w-[140px] h-[200px] object-cover mb-2" 
      />
      <p className="text-white text-center text-sm">{actor.name}</p>
      <p className="text-gray-400 text-center text-xs">{actor.character}</p>
    </div>
  );
};

export default ActorCard;