import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Button } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { addSession } from "./api";
import { getHistorySession } from "./api";

const Container = styled.div`
width:240px;
height:100%;
margin-left:40px;
box-shadow:1px 4px 12px 0px rgba(0, 0, 0, 0.2);
padding:16px;
background-color:#fafafa;
`
const Item = styled.div`
    background-color:#f8f8f8;
    display:flex;
    padding:12px 20px;
    position:relative;
    justify-content:space-between;
    border-radius:10px;
    box-shadow:1px 4px 8px 0px rgba(0, 0, 0, 0.2);
    margin-bottom:8px;
    cursor:pointer;
    &:hover{
        background-color:#f1f1f1;
    }
    
`
const Title = styled.div`
    font-size:15px;
    line-height:26px;
    padding-right:16px;
    white-space: nowrap; 
    overflow: hidden; 
    text-overflow: ellipsis; 
}


`

const ButtonContainer = styled.div`
margin-top:20px;
    display:flex;
    justify-content:end;
    margin-bottom:20px;
`

const DeleteContainer = styled.div`
    width:20px;
    height:20px;
    display:flex;
    justify-content:center;
    padding:3px;
    align-items:end;
`

export const History = ({modelId}) => {
  const mainPage = useSelector((state) => state.PageState.Main_Page);
  const subPage = useSelector((state) => state.PageState.Sub_Page);
  const username = useSelector((state) => state.UserState.username);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function randStr() {
    const idStrings = "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let str = "";
    for (let i = 0; i < 12; i++) {
      const pos = Math.floor(Math.random() * idStrings.length); // 使用 floor 而不是 round
      str += idStrings[pos];
    }
    return str;
  }
  async function fetchData(username,modelId) {
    try {
     const response = await fetch(`http://10.98.193.46:8080/session/get-by-user-model?username=linajun&modelId=${modelId}`, {
        method: 'GET',
      })
      if (response.ok) {
        const data = await response.json();
        setData(data|| []); 
      }
    } catch (err) {
      setError(err);
    } 
  }
  useEffect(() => {
    fetchData(username,modelId);
  }, [username,modelId]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Container>
      <ButtonContainer>
        <Button type="primary" onClick={() => addSession({ modelId: subPage, sessionId: randStr() })}>
          <PlusOutlined /> 新增会话
        </Button>
      </ButtonContainer>
      {data.length > 0 ? data.map((item) => (
        <Item key={item.header}>
          <Title>{item.header}</Title>
          <DeleteContainer>
            <DeleteOutlined />
          </DeleteContainer>
        </Item>
      )) : <div></div>}
    </Container>
  );
};