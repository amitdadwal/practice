import styled from '@emotion/styled';
import { FC } from 'react';

import colors from 'styles/colors';

interface IButtonProps {
  backgroundColor: string;
}

const Button = styled.button<IButtonProps>`
  padding: 32px;
  background-color: ${colors.gray[900]};
  font-size: 24px;
  font-family: 'GeneralSans-Variable';
  font-weight: 400;
  font-style: italic;
  border-radius: 4px;
  color: ${colors.surface[50]};
  /* font-weight: bold; */
  &:hover {
    color: ${colors.surface[50]};
  }
`;

const StyledEmotionButton: FC = () => {
  return <Button backgroundColor="green">This my button component.</Button>;
};

export default StyledEmotionButton;
