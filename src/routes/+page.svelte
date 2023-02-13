

<script>
export const prerender = true;
    import { onMount } from 'svelte';
    import { csv } from 'd3';
    import { rgb, hsl } from 'd3-color';

    import PieChart from '../chart/PieChart.svelte'
    import BarChart from '../chart/BarChart.svelte'
    import HorizBarChart from '../chart/HorizBarChart.svelte'

    let data, dataMap, boxes = []

    class ColorSystem {
        constructor(colors, scheme='sequential') {
            this._colors = colors
            this._scheme = scheme
        }
        diverging() {
            return new ColorSystem(this._colors, 'diverging')
        }
        colors(count) {
            const brighter = (color, n, i) => {
                const c = hsl(color)
                const ret =  hsl(c.h, i*c.s/n, c.l + i*(1-c.l)/n)
                return ret.rgb().clamp()
            }
            const ret = Array.from({ length: count })
            //if (this.scheme == 'sequential')
            const aRgb = rgb(this._colors[0])
            const bRgb = rgb(this._colors[1])
            ret[0] = aRgb
            ret[count-1] = bRgb
            const k = Math.floor(count/2)
            if (count % 2 == 1) ret[k] = hsl((hsl(aRgb).h + hsl(bRgb).h) / 2, 0.05, 0.95).rgb()

            for (let i=1; i<k; i++) {
                ret[i] = brighter(aRgb, k, i)
                ret[count-i-1] = brighter(bRgb, k, i)
            }
            return ret.map(v => v.hex())
        }
        
    }

    const color = new ColorSystem(['#CDB380','#036564'])

    class Data {
        constructor(d, col=null, choice='single') {
            this.data = d
            this.col = col
            this.choice = choice
            this.calculate = 'count'
            this.color = null
            this.filters = []
            this.sort = undefined
        }
        singleChoice(col) {
            return new Data(this.data, col, 'single')
        }
        multiChoice(col) {
            return new Data(this.data, col, 'multi')
        }
        kpl(col) {
            return this.data[col].filter(v => v != '').length
        }
        count() {
            this.calculate = 'count'
            return this
        }
        filterEmpty() {
            this.filters.push((acc, value) => {
                if (value != '') acc.push(value)
                return acc
            })
            return this
        }
        filterRemove(removable) {
            this.filters.push((acc, value) => {
                console.log(value)
                if (this.choice == 'multi'){
                    acc.push(value.split(';').filter(v => v != removable).join(';'))
                } else
                    if (value != removable) acc.push(value)
                return acc
            })
            return this
        }
        filterChange(search, replace) {
            this.filters.push((acc, value) => {
                //console.log(value)
                if (this.choice == 'multi'){
                    acc.push(value.split(';').map(v => v == search? replace: v).join(';'))
                } else
                    acc.push(value == search ? replace: value)
                return acc
            })
            return this
        }
        filterTop(arr) {
            this.filters.push( (acc,val) => {
                const top = val.split(';').sort((a, b) => arr.indexOf(a) - arr.indexOf(b)).slice(-1)
                acc.push(top)
                return acc
            })
            return this
        }
        sortBy(arr) {
            this.sort = (a,b) => arr.indexOf(a) - arr.indexOf(b)
            return this
        }
        sortByValue() {
            this.sort = 'value'
            return this
        }
        colorize(c) {
            this.color = c
            return this
        }
        out() {
            const order = (unordered) => {
                if (this.sort == 'value') {
                    return Object.keys(unordered).sort((a,b)=>unordered[b]-unordered[a]).reduce(
                        (obj, key) => {
                            obj[key] = unordered[key]; 
                            return obj;
                        }, {})
                } else {
                    return Object.keys(unordered).sort(this.sort).reduce(
                        (obj, key) => {
                            obj[key] = unordered[key]; 
                            return obj;
                        }, {})
                }
            }

            let d = this.data[this.col]
            for (const filt of this.filters) d = d.reduce(filt, [])
            if (this.calculate == 'count') {
                if (this.choice == 'multi') {
                    d = d.reduce((acc, val) => {
                        for (const v of val.split(';')) acc.push(v)
                        return acc
                    }, [])
                }
                const count = 
                    order(d.reduce((acc, val) => {
                        if (!acc[val]) acc[val] = 0
                        acc[val]++
                        return acc
                    }, {}))

                const labels = Object.keys(count)
                const data = Object.values(count)
                const n = labels.length
                return {
                    labels,
                    datasets: [{
                        label: 'näytä',
                        data,
                        backgroundColor: this.color.colors(n),
                        hoverBackgroundColor: this.color.colors(n)
                    }]
                }
            }
        }
    }

	onMount(async () => {
        const data_ = await csv("jtr-data-2022.csv");
        const dataMap_ = {}
        data_.columns.forEach((col, idx)=>{
            dataMap_[col] = []
            Array.from(data_).forEach(row=>{
                dataMap_[col].push(row[col])
            })
        })
        //data = data_
        dataMap = dataMap_
        $: data = new Data(dataMap)
        console.log({ data, dataMap })

        calculate()
	});

    const calculate = () => {
        const d = dataMap['Ikä?']
        for (let i=2; i<10; i++)
            boxes.push(color.colors(i))
        $: boxes = boxes

        //pieChart(d, color.diverging())
    }


    const pieChart = (data, color) => {
        if (!data) return 'pie'
        return new PieChart(data, color)
    }
    const sum = (p) => {} 
</script>

<svelte:head>
  <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/@typopro/web-bebas-neue@3.7.5/TypoPRO-BebasNeue.css">
  <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet">
</svelte:head>

<div class="content">

<img class="logo" src="metso.png" alt="metso logo">
<h1>Jyväskylä Trail Runners kysely</h1>
<p>
Jyväskylä Trail Runners facebook-ryhmässä pyydettiin ihmisiä
vastaamaan ryhmän toimintaa ja ryhmäläisten liikkumista koskevaan kyselyyn vuodesta 2022.
Vastausten määrä oli 40kpl (<a href="https://mudyc.github.io/jtr-stats-2021/">2021</a>: 48kpl, <a href="https://mudyc.github.io/jtr-stats-2019/">2019</a>: 63 kpl, <a href="https://mudyc.github.io/jtr-stats-2018/">2018</a>, 98 kpl)
ryhmäläisten kokonaismäärä oli 1353 kpl (tarkastettu 4.2.2023, 2021: 1299 kpl, 2019: 1056 kpl, 2018: 888 kpl).
</p>
<!--

{#each boxes as bb}
  <div>
    {#each bb as b}
      <div style="display: inline-block; width: 3em; height: 3em; background-color: {b}"></div>
    {/each}
  </div>
{/each}
-->



<h2>Kyselyn taustatiedot</h2>
Kyselyn tekijällä kävi virhe ja taustatietoja ei kysytty 9 ensimmäiseltä vastaajalta.
<h3>Vastaajien kilpailusarja</h3>

{ data?.kpl('Sarja johon kirjaudun') } vastaajaa kertoi kyselyn alkutietoihin liittyvän kilpasarjan.

    <PieChart data={
        data?.singleChoice('Sarja johon kirjaudun')
        .filterEmpty()
        .count()
        .colorize(color.diverging())
        .out() }
    />


<h3>Vastaajien ikä</h3>

{ data?.kpl('Ikä?') } vastaajaa kertoi oman ikäryhmänsä. Pääosa juoksijoista on keski-iän molemmin puolin.

    <BarChart data={
        data?.singleChoice('Ikä?')
        .filterEmpty()
        .count()
        .colorize(color.diverging())
        .out() }
    />

<hr/>

<h2>Lähtötaso</h2>

<h3>Viimeisen vuoden aikana juostu (pisimmillään)</h3>

{ data?.kpl('Olen juossut viimeisen vuoden aikana') } vastasi kuinka pitkälle on pisimmillään juossut viimeisen vuoden aikana.

<BarChart data={
    data?.singleChoice('Olen juossut viimeisen vuoden aikana')
    .filterEmpty()
    .filterTop('1km lenkin,5km lenkin,10km lenkin,puolimaratonin,maratonin,ultran'.split(','))
    .sortBy('1km lenkin,5km lenkin,10km lenkin,puolimaratonin,maratonin,ultran'.split(','))
    .count()
    .colorize(color.diverging())
    .out() }
/>


<h3>Viimeisen vuoden aikana teen vähintään puolituntia kestävää liikuntaa</h3>

{ data?.kpl('Viimeisen vuoden aikana teen vähintään puolituntia kestävää liikuntaa') } 
vastaajaa kertoi kuinka usein on liikkunut viikottain viimeisen vuoden aikana.
Ryhmäläiset edustavat varsin liikkuvaa sakkia 💪

<HorizBarChart data={
    data?.singleChoice('Viimeisen vuoden aikana teen vähintään puolituntia kestävää liikuntaa')
    .filterEmpty()
    .count()
    .sortBy('noin kerran viikossa,yleensä kahdesti viikossa,kolmesti viikossa,neljästi viikossa,viidesti viikossa,kuudesti viikossa,seitsemästi viikossa,8 kertaa viikossa,9 kertaa viikossa,10 kertaa viikossa,11 kertaa viikossa,12 kertaa viikossa'.split(','))
    .colorize(color.diverging())
    .out() }
/>

<h3>Viimeisin Cooper tulokseni</h3>

{ data?.kpl('Viimeisin Cooper-tulokseni (valitse lähin)') } vastaajaa Cooper-tulokseen.

<HorizBarChart data={
    data?.singleChoice('Viimeisin Cooper-tulokseni (valitse lähin)')
    .filterEmpty()
    .count()
    .colorize(color.diverging())
    .out() }
/>
<img alt="cooper vertailutaulukko" src="cooper.png" >

<h3>Treenitavat</h3>

{ data?.kpl('Olen treenannut') } 
vastasi treenitavoistaan. Kiva huomata, että nopeaa kävelyäkin treenataan.

<HorizBarChart data={
    data?.multiChoice('Olen treenannut')
    .filterRemove('Uinti, jooga sekä hiihto')
    .filterRemove('Hiihto on toiminut nyt 3 vuotta talven päälajina:)')
    .filterEmpty()
    .sortByValue()
    .count()
    .colorize(color.diverging())
    .out() }
/>

<h3>Treeniseura</h3>

{ data?.kpl('Useimmiten treenaan') } 
vastasi kenen seurassa useimmiten treenaa.
Juoksuhan on yksilölaji ja sen kyllä huomaa.
Olisi mielenkiintoista tietää ketkä kolme 
treenaavat useimmiten kaksin 😁

<PieChart data={
    data?.singleChoice('Useimmiten treenaan')
    .filterEmpty()
    .count()
    .colorize(color.diverging())
    .out() }
/>

<h3>Toimet kovan treenin ohessa</h3>

{ data?.kpl('Kovan treenin ohessa') } 
vastasi mitä tekee kovan treenin ohessa.
<HorizBarChart data={
    data?.multiChoice('Kovan treenin ohessa')
    .filterRemove('Kaikkiin noihin muihin asioihin pitäisi panostaa, mutta aina on se kiire...')
    .filterEmpty()
    .sortByValue()
    .count()
    .colorize(color.diverging())
    .out() }
/>

<hr/>
<h2>Haaveet ja tavoitteet</h2>

<h3>Tavoitteenani on</h3>
{ data?.kpl('Tavoitteenani on') } 
vastasi tavoitteisiinsa.
Luonnosta nauttiminen säilyy jo neljättä kertaa ykkösenä.
<HorizBarChart data={
    data?.multiChoice('Tavoitteenani on')
    .filterEmpty()
    .sortByValue()
    .count()
    .colorize(color.diverging())
    .out() }
/>

<h3>Haaveissani olisi</h3>
{ data?.kpl('Haaveissani olisi') } 
vastasi haaveistaan.
Pidempi juoksuvaellus on mielenkiintoinen haave ja tämä vaatii ehdottomasti lisäkeskustelua ryhmässä.
Viime vuonna UTMB-kisaan osallistuneena suosittelen kaikille. On sellainen "once in a lifetime" -kisaviikko.
<HorizBarChart data={
    data?.multiChoice('Haaveissani olisi')
    .filterEmpty()
    .sortByValue()
    .count()
    .colorize(color.diverging())
    .out() }
/>

<h3>Isoimmat esteet haaveilleni ovat kaiketi</h3>
{ data?.kpl('Isoimmat esteet haaveilleni ovat kaiketi') } 
vastasi esteistään.
<HorizBarChart data={
    data?.multiChoice('Isoimmat esteet haaveilleni ovat kaiketi')
    .filterEmpty()
    .filterChange('Lääkäreiden määräämä toistaiseksi voimassa oleva liikuntakielto. ', 'Sairaus')
    .filterChange('burn out', 'Sairaus')
    .filterChange('Triathlon vie liikaa aikaa..', 'Muut lajit')
    .filterChange('Liian paljon vaihtoehtoja', 'Muut lajit')
    .sortByValue()
    .count()
    .colorize(color.diverging())
    .out() }
/>

<h3>Uudet reitit</h3>
{ data?.kpl('Uusilla reiteillä seuraan') } 
vastasi miten uusilla reiteillä etenee.
<HorizBarChart data={
    data?.multiChoice('Uusilla reiteillä seuraan')
    .filterEmpty()
    .filterChange('Lääkäreiden määräämä toistaiseksi voimassa oleva liikuntakielto. ', 'Sairaus')
    .filterChange('burn out', 'Sairaus')
    .filterChange('Triathlon vie liikaa aikaa..', 'Muut lajit')
    .filterChange('Liian paljon vaihtoehtoja', 'Muut lajit')
    .sortByValue()
    .count()
    .colorize(color.diverging())
    .out() }
/>


<hr/>
<h2>Lähitreenit</h2>

<h3>Yhteislenkit</h3>
{ data?.kpl('Olen käynyt yhteislenkillä') } 
vastasi yhteislenkille osallistumisestaan.
<PieChart data={
    data?.singleChoice('Olen käynyt yhteislenkillä')
    .filterEmpty()
    .count()
    .colorize(color.diverging())
    .out() }
/>

<h3>Yhteislenkki koettiin</h3>
{ data?.kpl('Yhteislenkki oli (jos osallistuit)') } 
vastasi kokemuksestaan.
<HorizBarChart data={
    data?.multiChoice('Yhteislenkki oli (jos osallistuit)')
    .filterEmpty()
    .sortByValue()
    .count()
    .colorize(color.diverging())
    .out() }
/>

<h3>Kätevät treenipaikat</h3>
{ data?.kpl('Minulle käteviä treenipaikkoja olisivat') } 
vastasi heille soveliaista treenipaikoista.
<HorizBarChart data={
    data?.multiChoice('Minulle käteviä treenipaikkoja olisivat')
    .filterEmpty()
    .filterRemove('Asun Helsingissä. Täällä Keskuspuisto on yksi vaihtoehto.')
    .filterChange('Moneen paikkaan pääsen 😀', 'Kaikki käy')
    .filterChange('Aivan samaa missä.', 'Kaikki käy')
    .filterChange('Autolla pääsee', 'Kaikki käy')
    .filterChange('Aika iso alue käy kellonajasta riippuen', 'Kaikki käy')
    .sortByValue()
    .count()
    .colorize(color.diverging())
    .out() }
/>

<h3>Käyn treeneissä yleensä</h3>
{ data?.kpl('Käyn treeneissä yleensä') } 
vastasi liikkumistapaan treeneihin.
<HorizBarChart data={
    data?.multiChoice('Käyn treeneissä yleensä')
    .filterEmpty()
    .sortByValue()
    .count()
    .colorize(color.diverging())
    .out() }
/>


<h3>Paras ajoitus olisi (kellonaika) - [puhelin vaakatasoon]</h3>
<!--
Paras ajoitus olisi (kellonaika) - [puhelin vaakatasoon]
{ data?.kpl('Paras ajoitus olisi (kellonaika) - [puhelin vaakatasoon]') } 
vastasi liikkumistapaan treeneihin.
<BarChart data={
    data?.multiChoice('Paras ajoitus olisi (kellonaika) - [puhelin vaakatasoon]')
    .filterEmpty()
    .count()
    .colorize(color.diverging())
    .out() }
/>
-->

<h3>Optimaalinen treeni</h3>
{ data?.kpl('Treenimääränä minusta olisi optimaalinen') } 
vastasi.
<BarChart data={
    data?.multiChoice('Treenimääränä minusta olisi optimaalinen')
    .filterEmpty()
    .count()
    .colorize(color.diverging())
    .out() }
/>

<h3>Treenin tehokkuus tulisi olla</h3>
{ data?.kpl('Treenin tehokkuus tulisi olla mielestäni') } 
vastasi.
<HorizBarChart data={
    data?.multiChoice('Treenin tehokkuus tulisi olla mielestäni')
    .filterEmpty()
    .sortByValue()
    .count()
    .colorize(color.diverging())
    .out() }
/>


<h3>Treenimaaston tulisi sisältää</h3>
{ data?.kpl('Treenimaaston tulisi sisältää') } 
vastasi.
<HorizBarChart data={
    data?.multiChoice('Treenimaaston tulisi sisältää')
    .filterEmpty()
    .sortByValue()
    .count()
    .colorize(color.diverging())
    .out() }
/>

<h3>Treeneistä tulisi ilmoittaa</h3>
{ data?.kpl('Treeneistä tulisi ilmoittaa') } 
vastasi.
<HorizBarChart data={
    data?.multiChoice('Treeneistä tulisi ilmoittaa')
    .filterEmpty()
    .sortByValue()
    .count()
    .colorize(color.diverging())
    .out() }
/>

<h3>Koronan vaikutus</h3>
{ data?.kpl('Korona on vaikuttanut') } 
vastasi.
<PieChart data={
    data?.singleChoice('Korona on vaikuttanut')
    .filterEmpty()
    .count()
    .colorize(color.diverging())
    .out() }
/>

<hr/>
<h2>Parasta toiminnassa on ollut</h2>

{ data?.kpl('Parasta yhteistoimintaa on ollut') } 
vastasi.
<HorizBarChart data={
    data?.multiChoice('Parasta yhteistoimintaa on ollut')
    .filterEmpty()
    .sortByValue()
    .count()
    .colorize(color.diverging())
    .out() }
/>
<hr/>
<h2>Muut harrastukset</h2>

{ data?.kpl('Harrastan myös') } 
vastasi muita harrastuksia koskevaan kyselyyn. Yksittäisiä vastauksia tuli myös seuraavia:
<ul>
<li>skeittaus</li>
<li>potkukelkkailu</li>
<li>padel</li>
<li>ratsastus</li>
<li>jumpat</li>
<li>combat</li>
<li>rullaluistelu</li>
<li>sähly</li>
<li>jääkiekko</li>
</ul>
<HorizBarChart data={
    data?.multiChoice('Harrastan myös')
    .filterEmpty()
    .filterChange('Tanssia', 'Tanssi')
    .filterChange('Sali', 'Kuntosali')
    .filterChange('Kuntosali ', 'Kuntosali')
    .filterChange('Punttisali', 'Kuntosali')
    .filterChange('Salilla/jumpassa käyti', 'Kuntosali')
    .filterChange('Kippurasarvipyöräily', 'Maantiepyöräily')
    .filterRemove('Ehkä jatkossa retkiluistelu jos raskin ostaa varusteet')
    .filterRemove('Toivottavasti pian vapaasukellusta. Villasukkaulkoilua, paljasjalkailua, yin-joogaa, meditointia ')
    .filterRemove('Skeittaaminen')
    .filterRemove('Potkukelkkailu')
    .filterRemove(' combat')
    .filterRemove('Padel, ratsastus')
    .filterRemove('Jumpat')
    .filterRemove('Rullaluistelu, jääkiekko, sähly')
    .sortByValue()
    .count()
    .colorize(color.diverging())
    .out() }
/>

</div>

  <style>
    :global(body) {
        font-family: 'Montserrat', sans-serif;
    }
    img {
      display: block;
      margin: 0 auto;
    }
    img.logo {
      width: 200px;
    }
    h1,h2,h3,h4 {
      text-align: center;
      font-family: 'TypoPRO Bebas Neue';
    }
    h3 {
      font-size: 1.3em;
    }
    .content {
      max-width: 800px;
      margin: 0 auto;
    }
    hr {
      margin: 5em;
      border-width: 2px;
      border-color: #3a8887;
    }
  </style>