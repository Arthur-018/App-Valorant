import { Pressable, StyleSheet, Text } from "react-native"
 

export const Button = ({ onPress, title, icon, outline }) => {
  return (
   <Pressable 
  onPress={onPress}
  style={({ hovered, pressed }) => [
    styles.button,
    outline && styles.outlineButton,
    hovered && styles.hover,
    pressed && styles.pressed
  ]}
>
  {icon}
  <Text style={[styles.buttonText, outline && styles.outlineButtonText]}>
    {title}
  </Text>
</Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#000000',
    borderRadius: 32,
    padding: 8,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderColor: '#000000',
    borderWidth: 2
  },
  hover: {
    opacity: 0.8,
  },
  pressed: {
    opacity: 0.5,
  },
  buttonText: {
    textAlign: 'center',
    color: '#f0f0f0',
    fontSize: 18,
    fontFamily: 'Bebas'
},
  outlineButtonText: {
    color: '#000000',
  },
})