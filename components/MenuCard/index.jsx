import { Pressable, StyleSheet, Text } from "react-native";

export function MenuCard({ title, onPress }) {
    return(
        <Pressable 
        onPress={onPress}
        style={({ hovered, pressed }) => [
            styles.card,
            hovered && styles.hover,
            pressed && styles.pressed,
        ]}
        >
          <Text style={styles.title}>{title}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    card:{
        width: '100%',
        paddingVertical: 20,
        paddingHorizontal: 18,
        borderRadius: 16,
        backgroundColor: '#1f1f1f',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)'
    },
    hover: {
        opacity: 0.8,
    },
    pressed: {
        opacity: 0.65,
    },
    title: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: '700',
    },
})