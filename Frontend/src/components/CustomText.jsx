import React from 'react';

const CustomText = (props) => {
  const text = props.props;

  return (
    <>
      <h1 className="overflow-hidden text-2xl font-bold leading-6 text-left text-black">
        {text.split('').map((char, index) => (
          <span
            className="animate-text-reveal inline-block"
            key={`${char}-${index}`}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </h1>
    </>
  );
}

export default CustomText;
