

<script>
export const prerender = true;
    import { onMount } from 'svelte';
    import { csv } from 'd3';
    import { rgb, hsl } from 'd3-color';

    import PieChart from '../chart/PieChart.svelte'
    import BarChart from '../chart/BarChart.svelte'
    import HorizBarChart from '../chart/HorizBarChart.svelte'
import { assets, base } from '$app/paths';
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
            this.groups = undefined
        }
        singleChoice(col) {
            return new Data(this.data, col, 'single')
        }
        multiChoice(col) {
            return new Data(this.data, col, 'multi')
        }
        groupChoice(grp) {
            return new Data(this.data, grp, 'group')
        }
        grps(arr) {
            this.groups = arr
            return this
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
                //console.log(value)
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

            if (['single','multi'].includes(this.choice)) {
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
                            label: 'n??yt??',
                            data,
                            backgroundColor: this.color.colors(n),
                            hoverBackgroundColor: this.color.colors(n)
                        }]
                    }
                }
            }
            if (this.choice == 'group') {
                const labels = Object.keys(this.col)
                const colors = this.color.colors(this.groups.length)
                const datasets = []
                for (const g of this.groups) {
                    datasets.push({
                        label: g,
                        data: labels.map(grp => {
                            let d = this.data[this.col[grp]]
                            for (const filt of this.filters) d = d.reduce(filt, [])

                            d = d.reduce((acc, val) => {
                                for (const v of val.split(';')) acc.push(v)
                                return acc
                            }, [])
                            const count = d.reduce((acc, val) => {
                                if (!acc[val]) acc[val] = 0
                                acc[val]++
                                return acc
                            }, {})
                            return count[g]
                        }),
                        backgroundColor: colors[this.groups.indexOf(g)]
                    })
                }
                return {
                    labels,
                    datasets
                }
            }
        }
    }

	onMount(async () => {
        const data_ = await csv(base + "/jtr-data-2022.csv");
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
        const d = dataMap['Ik???']
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

<img class="logo" src="{base}/metso.png" alt="metso logo">
<h1>Jyv??skyl?? Trail Runners kysely</h1>
<p>
Jyv??skyl?? Trail Runners facebook-ryhm??ss?? pyydettiin ihmisi??
vastaamaan ryhm??n toimintaa ja ryhm??l??isten liikkumista koskevaan kyselyyn vuodesta 2022.
Vastausten m????r?? oli 40kpl (<a href="https://mudyc.github.io/jtr-stats-2021/">2021</a>: 48kpl, <a href="https://mudyc.github.io/jtr-stats-2019/">2019</a>: 63 kpl, <a href="https://mudyc.github.io/jtr-stats-2018/">2018</a>, 98 kpl)
ryhm??l??isten kokonaism????r?? oli 1353 kpl (tarkastettu 4.2.2023, 2021: 1299 kpl, 2019: 1056 kpl, 2018: 888 kpl).
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
Kyselyn tekij??ll?? k??vi virhe ja taustatietoja ei kysytty 9 ensimm??iselt?? vastaajalta.
<h3>Vastaajien kilpailusarja</h3>

{ data?.kpl('Sarja johon kirjaudun') } vastaajaa kertoi kyselyn alkutietoihin liittyv??n kilpasarjan.

    <PieChart data={
        data?.singleChoice('Sarja johon kirjaudun')
        .filterEmpty()
        .count()
        .colorize(color.diverging())
        .out() }
    />


<h3>Vastaajien ik??</h3>

{ data?.kpl('Ik???') } vastaajaa kertoi oman ik??ryhm??ns??. P????osa juoksijoista on keski-i??n molemmin puolin.

    <BarChart data={
        data?.singleChoice('Ik???')
        .filterEmpty()
        .count()
        .colorize(color.diverging())
        .out() }
    />

<hr/>

<h2>L??ht??taso</h2>

<h3>Viimeisen vuoden aikana juostu (pisimmill????n)</h3>

{ data?.kpl('Olen juossut viimeisen vuoden aikana') } vastasi kuinka pitk??lle on pisimmill????n juossut viimeisen vuoden aikana.

<BarChart data={
    data?.singleChoice('Olen juossut viimeisen vuoden aikana')
    .filterEmpty()
    .filterTop('1km lenkin,5km lenkin,10km lenkin,puolimaratonin,maratonin,ultran'.split(','))
    .sortBy('1km lenkin,5km lenkin,10km lenkin,puolimaratonin,maratonin,ultran'.split(','))
    .count()
    .colorize(color.diverging())
    .out() }
/>


<h3>Viimeisen vuoden aikana teen v??hint????n puolituntia kest??v???? liikuntaa</h3>

{ data?.kpl('Viimeisen vuoden aikana teen v??hint????n puolituntia kest??v???? liikuntaa') } 
vastaajaa kertoi kuinka usein on liikkunut viikottain viimeisen vuoden aikana.
Ryhm??l??iset edustavat varsin liikkuvaa sakkia ????

<HorizBarChart data={
    data?.singleChoice('Viimeisen vuoden aikana teen v??hint????n puolituntia kest??v???? liikuntaa')
    .filterEmpty()
    .count()
    .sortBy('noin kerran viikossa,yleens?? kahdesti viikossa,kolmesti viikossa,nelj??sti viikossa,viidesti viikossa,kuudesti viikossa,seitsem??sti viikossa,8 kertaa viikossa,9 kertaa viikossa,10 kertaa viikossa,11 kertaa viikossa,12 kertaa viikossa'.split(','))
    .colorize(color.diverging())
    .out() }
/>

<h3>Viimeisin Cooper tulokseni</h3>

{ data?.kpl('Viimeisin Cooper-tulokseni (valitse l??hin)') } vastaajaa Cooper-tulokseen.

<HorizBarChart data={
    data?.singleChoice('Viimeisin Cooper-tulokseni (valitse l??hin)')
    .filterEmpty()
    .count()
    .colorize(color.diverging())
    .out() }
/>
<img alt="cooper vertailutaulukko" src="{base}/cooper.png" >

<h3>Treenitavat</h3>

{ data?.kpl('Olen treenannut') } 
vastasi treenitavoistaan. Kiva huomata, ett?? nopeaa k??vely??kin treenataan.

<HorizBarChart data={
    data?.multiChoice('Olen treenannut')
    .filterRemove('Uinti, jooga sek?? hiihto')
    .filterRemove('Hiihto on toiminut nyt 3 vuotta talven p????lajina:)')
    .filterEmpty()
    .sortByValue()
    .count()
    .colorize(color.diverging())
    .out() }
/>

<h3>Treeniseura</h3>

{ data?.kpl('Useimmiten treenaan') } 
vastasi kenen seurassa useimmiten treenaa.
Juoksuhan on yksil??laji ja sen kyll?? huomaa.
Olisi mielenkiintoista tiet???? ketk?? kolme 
treenaavat useimmiten kaksin ????

<PieChart data={
    data?.singleChoice('Useimmiten treenaan')
    .filterEmpty()
    .count()
    .colorize(color.diverging())
    .out() }
/>

<h3>Toimet kovan treenin ohessa</h3>

{ data?.kpl('Kovan treenin ohessa') } 
vastasi mit?? tekee kovan treenin ohessa.
<HorizBarChart data={
    data?.multiChoice('Kovan treenin ohessa')
    .filterRemove('Kaikkiin noihin muihin asioihin pit??isi panostaa, mutta aina on se kiire...')
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
Luonnosta nauttiminen s??ilyy jo nelj??tt?? kertaa ykk??sen??.
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
Pidempi juoksuvaellus on mielenkiintoinen haave ja t??m?? vaatii ehdottomasti lis??keskustelua ryhm??ss??.
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
vastasi esteist????n.
<HorizBarChart data={
    data?.multiChoice('Isoimmat esteet haaveilleni ovat kaiketi')
    .filterEmpty()
    .filterChange('L????k??reiden m????r????m?? toistaiseksi voimassa oleva liikuntakielto. ', 'Sairaus')
    .filterChange('burn out', 'Sairaus')
    .filterChange('Triathlon vie liikaa aikaa..', 'Muut lajit')
    .filterChange('Liian paljon vaihtoehtoja', 'Muut lajit')
    .sortByValue()
    .count()
    .colorize(color.diverging())
    .out() }
/>

<h3>Uudet reitit</h3>
{ data?.kpl('Uusilla reiteill?? seuraan') } 
vastasi miten uusilla reiteill?? etenee.
<HorizBarChart data={
    data?.multiChoice('Uusilla reiteill?? seuraan')
    .filterEmpty()
    .filterChange('L????k??reiden m????r????m?? toistaiseksi voimassa oleva liikuntakielto. ', 'Sairaus')
    .filterChange('burn out', 'Sairaus')
    .filterChange('Triathlon vie liikaa aikaa..', 'Muut lajit')
    .filterChange('Liian paljon vaihtoehtoja', 'Muut lajit')
    .sortByValue()
    .count()
    .colorize(color.diverging())
    .out() }
/>


<hr/>
<h2>L??hitreenit</h2>

<h3>Yhteislenkit</h3>
{ data?.kpl('Olen k??ynyt yhteislenkill??') } 
vastasi yhteislenkille osallistumisestaan.
<PieChart data={
    data?.singleChoice('Olen k??ynyt yhteislenkill??')
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

<h3>K??tev??t treenipaikat</h3>
{ data?.kpl('Minulle k??tevi?? treenipaikkoja olisivat') } 
vastasi heille soveliaista treenipaikoista.
<HorizBarChart data={
    data?.multiChoice('Minulle k??tevi?? treenipaikkoja olisivat')
    .filterEmpty()
    .filterRemove('Asun Helsingiss??. T????ll?? Keskuspuisto on yksi vaihtoehto.')
    .filterChange('Moneen paikkaan p????sen ????', 'Kaikki k??y')
    .filterChange('Aivan samaa miss??.', 'Kaikki k??y')
    .filterChange('Autolla p????see', 'Kaikki k??y')
    .filterChange('Aika iso alue k??y kellonajasta riippuen', 'Kaikki k??y')
    .sortByValue()
    .count()
    .colorize(color.diverging())
    .out() }
/>

<h3>K??yn treeneiss?? yleens??</h3>
{ data?.kpl('K??yn treeneiss?? yleens??') } 
vastasi liikkumistapaan treeneihin.
<HorizBarChart data={
    data?.multiChoice('K??yn treeneiss?? yleens??')
    .filterEmpty()
    .sortByValue()
    .count()
    .colorize(color.diverging())
    .out() }
/>


<h3>Paras ajoitus treenille</h3>
{ data?.kpl('Paras ajoitus olisi (kellonaika) - [puhelin vaakatasoon] [Maanantai]') } 
vastasi treenien parhaaseen ajoitukseen eri p??ivin??.

<BarChart data={
    data?.groupChoice({
        Maanantai: 'Paras ajoitus olisi (kellonaika) - [puhelin vaakatasoon] [Maanantai]',
        Tiistai: 'Paras ajoitus olisi (kellonaika) - [puhelin vaakatasoon] [Tiistai]',
        Keskiviikko: 'Paras ajoitus olisi (kellonaika) - [puhelin vaakatasoon] [Keskiviikko]',
        Torstai: 'Paras ajoitus olisi (kellonaika) - [puhelin vaakatasoon] [Torstai]',
        Perjantai: 'Paras ajoitus olisi (kellonaika) - [puhelin vaakatasoon] [Perjantai]'
    })
    .grps('5-7,7-10,10-12,12-15,15-17,17-19,19-21,>21'.split(','))
    .filterEmpty()
    .count()
    .colorize(color.diverging())
    .out() }
/>
<BarChart data={
    data?.groupChoice({
        Lauantai: 'Paras ajoitus olisi (kellonaika) - [puhelin vaakatasoon] [Lauantai]',
        Sunnuntai: 'Paras ajoitus olisi (kellonaika) - [puhelin vaakatasoon] [Sunnuntai]'
    })
    .grps('5-7,7-10,10-12,12-15,15-17,17-19,19-21,>21'.split(','))
    .filterEmpty()
    .count()
    .colorize(color.diverging())
    .out() }
/>


<h3>Optimaalinen treeni</h3>
{ data?.kpl('Treenim????r??n?? minusta olisi optimaalinen') } 
vastasi.
<BarChart data={
    data?.multiChoice('Treenim????r??n?? minusta olisi optimaalinen')
    .filterEmpty()
    .count()
    .colorize(color.diverging())
    .out() }
/>

<h3>Treenin tehokkuus tulisi olla</h3>
{ data?.kpl('Treenin tehokkuus tulisi olla mielest??ni') } 
vastasi.
<HorizBarChart data={
    data?.multiChoice('Treenin tehokkuus tulisi olla mielest??ni')
    .filterEmpty()
    .sortByValue()
    .count()
    .colorize(color.diverging())
    .out() }
/>


<h3>Treenimaaston tulisi sis??lt????</h3>
{ data?.kpl('Treenimaaston tulisi sis??lt????') } 
vastasi.
<HorizBarChart data={
    data?.multiChoice('Treenimaaston tulisi sis??lt????')
    .filterEmpty()
    .sortByValue()
    .count()
    .colorize(color.diverging())
    .out() }
/>

<h3>Treeneist?? tulisi ilmoittaa</h3>
{ data?.kpl('Treeneist?? tulisi ilmoittaa') } 
vastasi.
<HorizBarChart data={
    data?.multiChoice('Treeneist?? tulisi ilmoittaa')
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

{ data?.kpl('Harrastan my??s') } 
vastasi muita harrastuksia koskevaan kyselyyn. Yksitt??isi?? vastauksia tuli my??s seuraavia:
<ul>
<li>skeittaus</li>
<li>potkukelkkailu</li>
<li>padel</li>
<li>ratsastus</li>
<li>jumpat</li>
<li>combat</li>
<li>rullaluistelu</li>
<li>s??hly</li>
<li>j????kiekko</li>
</ul>
<HorizBarChart data={
    data?.multiChoice('Harrastan my??s')
    .filterEmpty()
    .filterChange('Tanssia', 'Tanssi')
    .filterChange('Sali', 'Kuntosali')
    .filterChange('Kuntosali ', 'Kuntosali')
    .filterChange('Punttisali', 'Kuntosali')
    .filterChange('Salilla/jumpassa k??yti', 'Kuntosali')
    .filterChange('Kippurasarvipy??r??ily', 'Maantiepy??r??ily')
    .filterRemove('Ehk?? jatkossa retkiluistelu jos raskin ostaa varusteet')
    .filterRemove('Toivottavasti pian vapaasukellusta. Villasukkaulkoilua, paljasjalkailua, yin-joogaa, meditointia ')
    .filterRemove('Skeittaaminen')
    .filterRemove('Potkukelkkailu')
    .filterRemove(' combat')
    .filterRemove('Padel, ratsastus')
    .filterRemove('Jumpat')
    .filterRemove('Rullaluistelu, j????kiekko, s??hly')
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