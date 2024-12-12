import styled from "styled-components";



function App() {
  return (
    <div>
      <H1>Heelo world</H1>
      <Button onClick={() => alert('helo')}>Check in</Button>
      <Input type="number" placeholder="dflv nedlkv" />
    </div>
  );
}

const H1 = styled.h1`
  font-size: 4rem;
  font-weight: bold;
`;

const Button = styled.button`
  font-size: 1.4rem;
  padding: 1.2rem 1.6rem;
  font-weight: 500;
  border: none;
  border-radius: 7px;
  background-color: purple;
  color: wheat;
`
const Input = styled.input`
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 0.8rem 1.5rem;
`

export default App;
