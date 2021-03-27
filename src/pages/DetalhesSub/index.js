import React, {useState, useEffect} from 'react';
import {useLocation, useHistory} from 'react-router-dom';
import './styles.css';
import '../../global.css';
import Header from '../Header';
import Title from '../Title';
import api from '../../services/api';

export default function DetSub(){

    const [turma, setTurma] = useState(null);
    const [data, setData] = useState(null);
    const [prof, setSubstituido] = useState(null);
    const [profSub, setSubstituto] = useState(null);
    const [mat, setMatSubstituida] = useState(null);
    const [matSub, setMatSubstituta] = useState(null);
    const [horario, setHorario] = useState(null);
    const [horariofim, setHorariofim] = useState(null);
    const [status, setStatus] = useState(null);
    const [idprofff, setId] = useState(null);
    const [obs, setObs] = useState(null);
    const profidlog = localStorage.getItem('email');
    const history = useHistory();
    let query = useQuery();

    function useQuery() {
        return new URLSearchParams(useLocation().search);
    }

    useEffect(() => {
        api.get('substituicoes/'+query.get("id")).then(response =>{
            save(response.data) 
            if(response.data[0].matsub == null){
                document.getElementById('matsub').innerHTML = 'Aplicação de conteúdo definido pelo professor da disciplina';
            }else{
                document.getElementById('matsub').innerHTML = 'Matéria substituta:<br/><p class="_valor">'+response.data[0].matsub+'</p>';
            }
        })  
    },[]);

    function save([{nome,turma, horario, horariofim, profsub, mat, matsub, data, email, status,obs}]){
        setTurma(turma);
        setData(tratadata(data));
        setMatSubstituida(mat);
        setMatSubstituta(matsub);
        setHorario(horario);
        setHorariofim(horariofim);
        setSubstituido(nome);
        setSubstituto(profsub);
        setObs(obs);
        var nstatus = status;
        if(nstatus === 'Agendado' || nstatus === 'Requerido'){
        const dataagora = new Date();
        const dataagen = new Date(data);
        if(dataagora.getTime() - 86400000>dataagen.getTime()){
            nstatus = "Expirou";  
        }}
        setStatus(nstatus);
        setId(email);

        if(profidlog == email && status != 'Cancelada'){
            var botao = document.getElementById('cancela')
            botao.style.display = 'inline-block';
        }
    }

    function cancela(){
        let test = window.confirm("Tem certeza de que deseja cancelar essa substituição ?");
        if(test && localStorage.getItem('email') == idprofff){
            const result = api.post('cancela/'+query.get('id'))
            history.push('/')
        }
    }

    function tratadata(date){
        var data = new Date(date);
        return(data.toLocaleDateString('pt-BR', {timeZone: 'UTC'}));
    }
    
    return(
        <div className="novasub-container">
            <Header />
            <div id="titulo"><Title titulo="Detalhes da substituição"></Title></div>
            <div className="dados-container">
                    <label className="inp">Turma:
                        <p className="short_valor">{turma}</p>
                    </label>
                    <label className="inp">Data da substituição:
                        <p className="short_valor">{data}</p>
                    </label>
                    <label className="inp">Nome do(a) professor(a) a ser substituído:<br/>
                        <p className="_valor">{prof}</p>
                    </label>
                    <label className="inp">Nome do(a) professor(a) substituto:<br/>
                        <p className="_valor">{profSub}</p>
                    </label>
                    <label className="inp">Matéria substituída:<br/>
                        <p className="_valor">{mat}</p>
                    </label>
                    <label id="matsub" className="inp">
                    </label>
                    <label className="inp">
                        Horário de início:<p id="hin" className="short_valor">{horario}</p>
                        Horário de fim:<p className="short_valor">{horariofim}</p>
                    </label>
                    <label className="inp">Status:
                        <p className="short_valor">{status}</p>
                    </label>
                    <label id="obsl" className="inp">
                        Observação:<br/>
                        <div id="obs" className="short_valor">{obs}</div>
                    </label>
                    <button className="button" id="cancela" onClick={cancela} >Cancelar</button>
            </div>
        </div>
    )
}