import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="loader" />
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .loader {
    width: 45px;
    height: 90px;
    position: relative;
  }
  .loader:after {
    content: "";
    position: absolute;
    inset: 0 0 20px;
    border-radius: 15px 15px 10px 10px;
    padding: 1px;
    background: linear-gradient(
        90deg,
        rgba(250, 248, 207, 1) 50%,
        rgba(89, 39, 4, 1) 50%,
        rgba(89, 39, 4, 1) 80%,
        rgba(89, 39, 4, 1) 80%,
        rgb(10, 4, 0) 100%
      )
      content-box;
    --c: radial-gradient(farthest-side, #000 94%, #0000);
    -webkit-mask:
      linear-gradient(#0000 0 0),
      var(--c) -10px -10px,
      var(--c) 15px -14px,
      var(--c) 9px -6px,
      var(--c) -12px 9px,
      var(--c) 14px 9px,
      var(--c) 23px 27px,
      var(--c) -8px 35px,
      var(--c) 50% 50%,
      linear-gradient(#000 0 0);
    mask:
      linear-gradient(#000 0 0),
      var(--c) -10px -10px,
      var(--c) 15px -14px,
      var(--c) 9px -6px,
      var(--c) -12px 9px,
      var(--c) 14px 9px,
      var(--c) 23px 27px,
      var(--c) -8px 35px,
      var(--c) 50% 50%,
      linear-gradient(#0000 0 0);
    -webkit-mask-composite: destination-out;
    mask-composite: exclude, add, add, add, add, add, add, add, add;
    -webkit-mask-repeat: no-repeat;
    animation: l2 6s infinite ease-out;
  }
  .loader:before {
    content: "";
    position: absolute;
    inset: 50% calc(50% - 4px) 0;
    background: #e0a267;
    border-radius: 50px;
    box-shadow: 1px 1px 0 #472000;
    animation: disappear 6s infinite;
  }

  @keyframes disappear {
    0% {
      scale: 1;
      background-color: #e0a267;
    }
    49% {
      background-color: #e0a267;
    }
    50% {
      scale: 1;
      background-color: #e0a267;
      transform: rotate(0deg);
    }
    75% {
      scale: 150;
      transform: rotate(45deg);
      background-color: #000;
    }
  }

  @keyframes l2 {
    0% {
      -webkit-mask-size:
        auto,
        0 0,
        0 0,
        0 0,
        0 0,
        0 0,
        0 0,
        0 0,
        0 0;
      opacity: 0;
    }
    2% {
      opacity: 1;
    }
    5% {
      -webkit-mask-size:
        auto,
        35px 35px,
        0 0,
        0 0,
        0 0,
        0 0,
        0 0,
        0 0,
        0 0;
    }
    10% {
      -webkit-mask-size:
        auto,
        35px 35px,
        35px 35px,
        0 0,
        0 0,
        0 0,
        0 0,
        0 0,
        0 0;
    }
    15% {
      -webkit-mask-size:
        auto,
        35px 35px,
        35px 35px,
        30px 30px,
        0 0,
        0 0,
        0 0,
        0 0,
        0 0;
    }
    20% {
      -webkit-mask-size:
        auto,
        35px 35px,
        35px 35px,
        30px 30px,
        30px 30px,
        0 0,
        0 0,
        0 0,
        0 0;
    }
    25% {
      -webkit-mask-size:
        auto,
        35px 35px,
        35px 35px,
        30px 30px,
        30px 30px,
        35px 35px,
        0 0,
        0 0,
        0 0;
    }
    30% {
      -webkit-mask-size:
        auto,
        35px 35px,
        35px 35px,
        30px 30px,
        30px 30px,
        35px 35px,
        35px 35px,
        0 0,
        0 0;
    }
    35% {
      -webkit-mask-size:
        auto,
        35px 35px,
        35px 35px,
        30px 30px,
        30px 30px,
        35px 35px,
        35px 35px,
        35px 35px,
        0 0;
    }
    40%,
    50% {
      -webkit-mask-size:
        auto,
        35px 35px,
        35px 35px,
        30px 30px,
        30px 30px,
        35px 35px,
        35px 35px,
        35px 35px,
        200% 200%;
    }
  }`;

export default Loader;
