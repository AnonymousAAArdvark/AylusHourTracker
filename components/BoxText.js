
import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
export default function BoxText({ content, color}) {
    return(
        <View style={styles.MainContainer}>
            <Text style={[styles.TextComponentStyle, { color }]}>{content}</Text>
        </View>
    )
  }

const styles = StyleSheet.create({

    MainContainer: {

        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    TextComponentStyle: {
        width: '95%',
        borderColor: 'blue',
        borderRadius: 5,

        // Set border width.
        borderWidth: 5,

        // Set border Hex Color Code Here.

        // Adding padding on Text component.
        padding : 2,

        fontSize: 20,

        textAlign: 'center',

        margin: 10
    }

});
