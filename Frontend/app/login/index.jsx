import { View, Text, Image, StyleSheet } from 'react-native'
import Colors from '../../constants/Colors';

export default function LoginScreen() {
  return (
    <View>
      <Image source={require('../../assets/images/login.jpg')}
      style={{
        width: '100%',
        height: 600,
      }}
      />

      <View style={styles.loginContainer}>
        <Text style={{
            fontSize: 30,
            fontWeight: 'bold',
            textAlign: 'center',
        }}>Welcome to Imagin AI</Text>
        <Text style={{
            color:Colors.GRAY,
            textAlign: 'center',
            marginTop: 15
        }}>Create AI Image Editing in just on Click</Text>

        <View></View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    loginContainer:{
        padding: 25,
        marginTop: -20,
        backgroundColor: 'white',
        height: 600,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,

    }
})