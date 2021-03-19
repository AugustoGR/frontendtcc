import React, {useEffect, useState} from 'react';
import './styles.css';
import '../../global.css';
import Header from '../Header';
import Title from '../Title';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import iconmore from  '../../assets/more.png'
import usericon from '../../assets/user.svg';

export default function Subs(){

    const [subList, setSubList] = useState([]);
    const [filtro, setFiltro] = useState("");
    const [lista, setLista] = useState("todas");
    const [selecionado, setSelecionado] = useState("Minhas Subs");

    function tratadata(date){
        var data = new Date(date);
        var d =data.getDate().toString();
        var m =(data.getMonth()+1).toString();
        var dia = (d.length === 1) ? '0'+d:d;
        dia++;
        var mes = (m.length === 1) ? '0'+m:m;
        return(dia+'/'+mes+'/'+data.getFullYear());
    }

    useEffect(()=>{
        api.get('substituicoes').then(resp => {
        setSubList(resp.data);
    })
    },[subList]);

    function logado(){
        
        if(localStorage.getItem('email')){
            const email = localStorage.getItem('email');
            const domain = email.split('@') 
            if(domain[1]==="campus.ifrs.edu.br"||domain[1]==="canoas.ifrs.edu.br"){
                return (
                    <div id="useritens">
                        <Link to="../novasub"><img id="more" alt="" src={iconmore} height="24px"/></Link>
                        <button onClick={minhasubs} id="minhasub" className="button">{selecionado}</button>
                    </div>
                )
            }
        }
    }
    function minhasubs(){
        if(lista === "todas"){
            setLista("minhas");
            setSelecionado("Todas as Subs")
        }
        else{
            setLista("todas");
            setSelecionado("Minhas Subs")
        }
    }
    return(
       <div className="maincontainer">
            <Header />
            <Title titulo="Lista de Substituições"></Title>
            <div id="options"><div id="filtra"><input placeholder="Filtrar..." id="filtertext" value={filtro} onChange={e =>setFiltro(e.target.value)}></input><img id="lupa"src="https://img.icons8.com/pastel-glyph/64/26e07f/search--v1.png"/></div>{logado()}</div>
            <div className="list-container">
                <div className="shadow">
                    <div className="list">
                        {
                        subList.reverse().map(sub =>{
                                    var testlist = false;
                                    var status = sub.status;
                                    if(sub.status === 'Agendado' || sub.status === 'Requerido'){
                                    const dataagora = new Date();
                                    const dataagen = new Date(sub.data);
                                    if(dataagora.getTime() - 86400000>dataagen.getTime()){
                                    status = "Expirou";
                                    }}
                                    if(lista === "minhas" && sub.email == localStorage.getItem('email')){
                                        testlist = true;
                                    }
                                    else if(sub.status != 'Requerido'){
                                        testlist = true;
                                    }
                                    if(testlist){
                                        if(filtro == sub.id || filtro == "" || filtro .toLowerCase() == sub.turma.toLowerCase() || filtro.toLowerCase() == sub.nome.toLowerCase()){
                                            var string = "/detalhessub?id="+sub.id;
                                            return(
                                                <Link id="fichabutton" to={string} key={sub.id}>
                                                    <div className="subsmodel">
                                                        <div className="photo"><img alt=""src={usericon}/></div>
                                                        <div className="dados">
                                                            <div><p>Professor(a): </p><p className="valor">{sub.nome}</p></div>
                                                            <div><p>Data: </p><p className="valor">{tratadata(sub.data)}</p></div>
                                                            <div id="id"><p>ID: </p><p className="valor">{sub.id}</p></div>
                                                            <div><p>Turma: </p><p className="valor">{sub.turma}</p></div>
                                                            <div><p>Status: </p><p className="valor">{status}</p></div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            )
                                        }
                                    }
                        })
                        }
                    </div>
                </div>
           </div>
       </div>
    )
}