import { View } from 'react-native'
import Header from '../../components/Home/Header'
import Banner from '../../components/Home/Banner'
import AiFeaturedModel from '../../components/Home/AiFeaturedModel'

export default function HomeTab() {
  return (
    <View style={{
        padding: 20,
        marginTop: 20
    }}>
      {/* header */}
        <Header/>
      {/* Baner */}
      <Banner/>
      {/* Featured List */}
      <AiFeaturedModel/>
    </View>
  )
}