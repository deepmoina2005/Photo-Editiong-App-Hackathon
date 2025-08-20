import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import Colors from '../../constants/Colors';
import * as WebBrowser from 'expo-web-browser'
import * as AuthSession from 'expo-auth-session'
import React, { useCallback, useEffect } from 'react'
import { useSSO } from '@clerk/clerk-expo'

export default function LoginScreen() {
  const { startSSOFlow } = useSSO()

  const onPress = useCallback(async () => {
    try {
      // Start the authentication process by calling `startSSOFlow()`
      const { createdSessionId, setActive, signIn, signUp } = await startSSOFlow({
        strategy: 'oauth_google',
        // For web, defaults to current path
        // For native, you must pass a scheme, like AuthSession.makeRedirectUri({ scheme, path })
        // For more info, see https://docs.expo.dev/versions/latest/sdk/auth-session/#authsessionmakeredirecturioptions
        redirectUrl: AuthSession.makeRedirectUri('/(tabs)/home'),
      })

      // If sign in was successful, set the active session
      if (createdSessionId) {
        // setActive!({ session: createdSessionId })
      } else {
        // If there is no `createdSessionId`,
        // there are missing requirements, such as MFA
        // Use the `signIn` or `signUp` returned from `startSSOFlow`
        // to handle next steps
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }, [])
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

        <TouchableOpacity onPress={onPress} style={styles.button}>
            <Text style={{textAlign:'center', color:'white', fontSize:17}}>Continue</Text>
        </TouchableOpacity>

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

export const useWarmUpBrowser = () => {
  useEffect(() => {
    // Preloads the browser for Android devices to reduce authentication load time
    // See: https://docs.expo.dev/guides/authentication/#improving-user-experience
    void WebBrowser.warmUpAsync()
    return () => {
      // Cleanup: closes browser when component unmounts
      void WebBrowser.coolDownAsync()
    }
  }, [])
}

// Handle any pending authentication sessions
WebBrowser.maybeCompleteAuthSession()