import { useEffect, useState } from "react";
import useSound from "use-sound";

const UseSound = ({ src, style = {} }) => {
  const { left, top, fontSize } = style;
  const [playAudio, setPlayAudio] = useState(false);
  const [play, { pause }] = useSound(src, {
    onend: () => {
      setPlayAudio(false);
    },
  });

  const handleClickAudio = () => {
    setPlayAudio(!playAudio);
  };

  useEffect(() => {
    playAudio ? play() : pause();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playAudio]);

  return (
    <div className="position-sound"
      fontSize={fontSize}
      left={left}
      top={top}
      onClick={handleClickAudio}
    >
      <i className="fa fa-volume-up" aria-hidden="true" />
    </div>
  );
};

export default UseSound;

