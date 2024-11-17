import fetch from "node-fetch";
import * as XLSX from "xlsx";

const EXPORT_PATH="./APIExcelCombinedData.xlsx";
const API_KEY_RAWG = "312f823559364349a4509bb5de274d3b";
const API_URL_RAWG="https://api.rawg.io/api/games";
let gameSearch_RAWG = "Final Fantasy";

const API_KEY_PANDASCORE ="58bAri-KdLzvIvAtliK8L2deNar7_pSmooMeImVAnIQQM0dRUcQ";
const API_URL_PANDASCORE ="https://api.pandascore.co/videogames";
const PER_PAGE= 10;
let page=1;

async function fetchGamesPandaScore(){
    const respone = await fetch(`${API_URL_PANDASCORE}?per_page=${PER_PAGE}&page=${page}`,{
        headers: {
            'Authorization': `Bearer ${API_KEY_PANDASCORE}`
        }
    });
    if (!respone.ok){
        console.log("Request failed");
        return;
    }
    const data= await respone.json();
    //console.log(data)
    return data;
}
async function fetchGamesRAWG(search){
    const respone = await fetch(`${API_URL_RAWG}?key=${API_KEY_RAWG}&search=${search}`);
    if (!respone.ok){
        console.log("Request failed");
        return;
    }
    const data= await respone.json();
    //console.log(data)
    return data;
}

//fetchGames("Final Fantasy")

function exportToExcel(data){
    const workbook=XLSX.utils.book_new();
    const worksheet=XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook,worksheet,"games");

    XLSX.writeFile(workbook, EXPORT_PATH);
}

async function gameFormater(){
    const exportData = []
    const gamesData= await fetchGamesPandaScore();
    if (!gamesData){
        console.log("something went wrong")
        return;
    } 
    for (const pandaGame of gamesData) {
        const gameResult = await fetchGamesRAWG(pandaGame.name)
        const game=gameResult.results[0];
        exportData.push({
            game:pandaGame.name,
            leagueName:pandaGame.leagues[0].name,
            rating:game.rating,
            image:game.background_image

        })
    };    


    exportToExcel(exportData);    
}
gameFormater();
//fetchGamesPandaScore();