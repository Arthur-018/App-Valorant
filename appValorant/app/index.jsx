import { Image, ImageBackground, StyleSheet, Text, View } from "react-native";
import { Link, router } from "expo-router";
import { Button } from "../components/Button";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/images/banner.png")}
        style={styles.banner}
        resizeMode="cover"
      />

      <View style={styles.center}>


        <Image
          style={styles.logo}
          source={require("../assets/images/logoBloqueio.png")}
          resizeMode="contain"
        />

        <Link href={{pathname: '/home'}}>
          Iniciar
        </Link>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Projeto para estudo
        </Text>
        <Text style={styles.footerText}>
          Desenvolvido por Arthur!
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#791212",

  },
  banner: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    width: 260,
    height: 180,
    marginBottom: -20
  },

  footer: {
    width: '80%',
    alignSelf: 'center',
    alignItems: 'center',
    paddingBottom: 30,
  },
  footerText: {
    textAlign: 'center',
    color: '#FFF',
    fontSize: 12.5,
    fontFamily: 'Neue'
  }
});