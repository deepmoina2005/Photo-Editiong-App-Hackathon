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

        <View style={styles.button}>
            <Text style={{textAlign:'center', color:'white', fontSize:17}}>Continue</Text>
        </View>

        <Text style={{
            textAlign: 'center',
            marginTop: 20,
            color: Colors.GRAY,
            fontSize:13
        }}>By Continuing you agree to ours tearm and conditions</Text>
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

    },
    button:{
        width: '100%',
        padding: 20,
        backgroundColor:Colors.PRIMARY,
        borderRadius: 40,
        marginTop: 20
    }
})