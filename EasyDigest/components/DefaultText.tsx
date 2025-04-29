// components/DefaultText.tsx
import { Text, TextProps } from 'react-native';

export default function DefaultText(props: TextProps) {
  return (
    <Text
      {...props}
      style={[{ fontFamily: 'Ubuntu-Medium' }, props.style]} // 기본 폰트
    >
      {props.children}
    </Text>
  );
}
