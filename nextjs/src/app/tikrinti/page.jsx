"use client";

// import ImageFallback from "@/helpers/ImageFallback";
// import MDXContent from "@/helpers/MDXContent";
// import { getListPage } from "@/lib/contentParser";
// import { markdownify } from "@/lib/utils/textConverter";

// import { RegularPage } from "@/types";

import React, { useEffect, useState } from 'react';
import Link from "next/link";
import axios from "axios";


import { FaSearch  } from "react-icons/fa";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import SeoMeta from "@/partials/SeoMeta";



const ShowSearchSection = ({handleChange, handleSubmit}) => {
  return (
    <section className="section">
      <div className="container">
        <div className="row justify-center">
          <div className="text-left md:col-10 lg:col-7">

            <h1 className="text-center" style={{marginBottom: 20}}>Tikrinti slapukų atitikimą</h1>
            <div className="text-center" style={{marginBottom: 30}}>Sužinokite, ar svetainės slapukų politika atitinka BDAR reglamentavimą</div>

            <div className="row mb-10 justify-center">
              <div className="lg:col-12">
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-nowrap">
                
                    <input
                      className="form-input rounded-r-none"
                      placeholder="Svetainės adresas (pvz: pavyzdys.lt)"
                      type="search"
                      name="search"
                      onChange={handleChange}
                      autoComplete="off"
                      autoFocus
                    />
                    <button className="btn btn-primary rounded-l-none" type="submit">
                      <FaSearch />
                    </button>
                  
                  </div>
                </form>
              </div>
            </div>
          
          </div>
        </div>
      </div>
    </section>
  )
}

const ShowPendingCheck = ({website}) => {
  return (
    <section className="section">
      <div className="content">
        <div className="row justify-center">
          <div className="text-left md:col-10 lg:col-7">
            <h2 className="text-center" style={{marginBottom: 20}}>Svetainės <u>{website}</u> slapukų tikrinimas užregistruotas</h2>
            {/* <div className="text-center" style={{marginBottom: 30}}>Rezultatai atsiras 15 min. bėgyje</div> */}
          </div>
        </div>
      </div>
    </section>
  )
}


const ShowResults = ({website, cookieData, loadingData}) => {
  return (
    <section className="section">
      <div className="content">
        <div className="row justify-center" style={{width: '100vw'}}>
          <div className="sm:col-10 md:col-10 lg:col-8">

            { cookieData.cookies.length > 0 ?
              <div>
                <h2  className="text-center" style={{marginBottom: 50}}>Slapukų atitikimas svetainėje: <u>{website}</u></h2>
                <h4  className="text-left" style={{marginBottom: 10}}>Sukuriami slapukai:</h4>
                <table>
                  <thead>
                    <tr>
                      <th align="left">Slapuko vardas</th>
                      <th align="center">Tipas</th>
                      <th align="center">Tikrinimo laikas</th>
                      <th align="center">Atitiktis</th>
                    </tr>
                  </thead>
                  <tbody>
                    { cookieData.cookies.map((cookie, index) => (
                      <tr key={index}>
                        <td align="left">{cookie.cookiename}</td>
                        <td align="center">{cookie.category}</td>
                        <td align="center">{cookie.datechecked}</td>
                        <td align="center">
                          { cookie.isallowedbdar === 1 ?
                            <CheckCircleIcon style={{ color: 'green', fontSize: 24 }}/>
                          :
                            <CancelIcon style={{ color: 'red', fontSize: 24 }}/> 
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            :
              <h2 className="text-center" style={{marginBottom: 50}}>
                Svetainė <u>{website}</u> nesukuria slapukų be sutikimo <CheckCircleIcon style={{ color: 'green', fontSize: 48 }}/>
              </h2>
            }


            <Link className="btn btn-outline-primary no-underline text-center" href={"https://atakosvektorius.lt/slapukai.html"}>
              Skaityti Daugiau Straipsnyje
            </Link>

          </div>
        </div>
      </div>
    </section>
  )
}



const GDPRChecker = () => {
  const [loadingData, setLoadingData] = useState(true);
  const [website, setWebsite] = useState('');
  const [cookieData, setCookieData] = useState([]);


  // Input Field
  const [inputVal, setInputVal] = useState('');
  const handleChange = (e) => {
    setInputVal(e.target.value);
  };


  // Submit button
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingData(true);
    setWebsite(inputVal);
    getResults(inputVal);
  };



  const getResults = (website) => {
    async function getData(sanitizedWebsite) {
      try {
        const response = await axios.get("https://slapukai.atakosvektorius.lt/api/getresults/" + sanitizedWebsite);
        console.log(response.data);
        setCookieData(response.data);
        setLoadingData(false);
      } catch (error) {
        console.log(error);
      }
    }


    const sanitizedWebsite = website.replace("https://", "").replace("http://", "").replace("www.", "").split('/')[0];
    setWebsite(sanitizedWebsite);
    getData(sanitizedWebsite);
    
  };


  return (
    <div>
      <SeoMeta
        title={"Atakos Vektorius - Tikrinti"}
        meta_title={"Atakos Vektorius - Tikrinti"}
        description={"Atakos Vektoriaus įrankis tikrinti slapukų atitikimui BDAR"}
        // image={image}
      />


      
      {website === '' ?
        <ShowSearchSection handleChange={handleChange} handleSubmit={handleSubmit} />
      :
        <>
          { !loadingData &&
            <>
              { cookieData.isscanned === 1 ?
                <ShowResults website={website} cookieData={cookieData} loadingData={loadingData}/>
              :
                <ShowPendingCheck website={website}/>
              }
            </>
          }
        </>
      }
    </div>
  );
};

export default GDPRChecker;
