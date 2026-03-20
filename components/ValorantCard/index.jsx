import { Pressable, StyleSheet, Text, View } from "react-native";


export default function ValorantCard({ title, image, subtitle, onPress }) {
    return (
      <Pressable
      onPress={onPress}
      style={({ hovered, pressed }) => [
        styles.card,
        hovered && styles.cardHover,
        pressed && styles.cardPressed,
      ]}
    >
      {!!image && (
        <Image
          source={{ uri: image }}
          style={styles.cardImage}
          resizeMode="cover"
        />
     )}
  <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {title}
        </Text>

        {!!subtitle && (
          <Text style={styles.cardSubtitle} numberOfLines={2}>
            {subtitle}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create ({
    card: {
        width: '48%',
        minHeight: 220,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#1f1f1f',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    cardHover: {
        opacity: 0.8,
    },
    cardPressed: {
        opacity: 0.65,
    },
    cardImage: {
        width: '100%',
        height: 150,
    },
    cardContent: {
        padding: 12,
    },
    cardTitle: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4,
    },
    cardSubtitle: {
        color: '#c9c9c9',
        fontSize: 13, },
})