import React, {useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import './styles.css';
import '../../global.css';
import api from '../../services/api';

export default function Confirma(){
    
    let query = useQuery();
    function useQuery() {
        return new URLSearchParams(useLocation().search);
    }

    useEffect(async ()=> {
        try{
        const result = await api.post('confirmacao/'+query.get("id")).then(() => {
            alert("Confirmação feita com sucesso");
            window.close();
        });
        }
        catch(err){
            alert("Erro, tente novamente");
        }
    },[]);

    return(
        <div id="confbody">
            <div id="divtxt">
                <h4>Confirmação em andamento</h4>
            </div>
        </div>
    )
}