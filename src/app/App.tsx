import React, { useEffect, useState } from 'react'
import s from "./App.module.css"
import { SearchBar } from '../components/searchBar/SearchBar';
import { Boards, BoardsType } from '../components/boards/Boards';
import { Form } from '../components/form/Form';

function App() {

    const [formActive, setFormActive] = useState<boolean>(false)

    const setFormActiveHandler = () => {
      setFormActive(prev => !prev)
    }
  
    return (
      <div className={s.appContainer}>
        <div className={s.appContainer__body}>
          <SearchBar />
          <Boards setFormActive={setFormActiveHandler}/>
        </div>
        {
          formActive ? 
          <div className={s.appContainer__form}>
            <Form setFormActive={setFormActiveHandler}/>
          </div>
          : ""
        }
      </div>
    );
}

export default App
