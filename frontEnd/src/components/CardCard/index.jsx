import React from "react"
import styled from 'styled-components'
const CardImage = styled.img`
width = 500px;
height = 100px;
`
const Title = styled.h1`
background-color: blue;
color: pink;
` 
export default function CardCard(props){
    
    let {src, title, value} = props
    // console.log(props.src)
    // let src = props.src
    // let title = props.title
    // let value = props.value
    return(
    <div>
        <Title>{title} {value}</Title>
        <CardImage src = {src}></CardImage>
    </div>)
}