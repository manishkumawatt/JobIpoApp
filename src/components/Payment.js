import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { StyleSheet, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import WebView from 'react-native-webview'
import { useFocusEffect } from '@react-navigation/native'
import Header from './Header'

const Payment = ({ navigation, route }) => {
    const { PaytmMID, txnToken, paymentLink, planDetails,
        operator,
        canumber } = route.params
    const [uri, setUri] = useState('')
    const [ready, setReady] = useState(false);
    const [webkey, setWebKey] = useState(Date.now());

    useFocusEffect(
        useCallback(() => {
            let isActive = true

            if (isActive) {
                setUri('https://jobipo.com/api/Agent/rechargeplink')
            }

            return () => {
                isActive = false
                setUri('')
            }

        }, [])
    )

    return (
        <View style={{
            flex: 1,
            backgroundColor: '#fff'
        }}>
            <Header title="Recharge Details" />

            {<WebView
                source={{
                    uri: uri,
                    method: 'POST',
                    body: JSON.stringify({
                        planDetails,
                        operator,
                        canumber: canumber,
                        amount: planDetails.rs,
                    })
                }}
                key={webkey}
                onLoadStart={(e) => {
                    const { nativeEvent } = e;
                    if (nativeEvent.url === 'about:blank' && !ready) {
                        setWebKey(Date.now());
                    }
                }}
                onLoadEnd={() => {
                    if (!ready) {
                        setWebKey(Date.now());
                        setReady(true)
                    }
                }}

                javaScriptEnabled={true}
                scalesPageToFit={true}
                automaticallyAdjustContentInsets={true}
                onMessage={event => {
                    let response = JSON.parse(event.nativeEvent.data);
                    // // console.log(response);
                }}
                style={{
                    flex: 1,
                }}
            />}
        </View>
    )
}

export default Payment

const styles = StyleSheet.create({})