function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

let turnData = [
  { turnNumber:4, missions: [{ name: 'Primary', score: 2 },
                            ] },
  { turnNumber:3, missions: [{ name: 'Primary', score: 0 },
                             { name: 'Establish Locus', score: 2 },
                             { name: 'Storm Hostile Objective', score: 1 }] },
  { turnNumber:2, missions: [{ name: 'Primary', score: 2 },
                             { name: 'Establish Locus', score: 4 },
                             { name: 'Storm Hostile Objective', score: 6 }] },
  { turnNumber:1, missions: [{ name: 'Primary', score: 3 },
                             { name: 'Establish Locus', score: 0 },
                             { name: 'Storm Hostile Objective', score: 11 }]
  },
];

// pull out every mission from every turn, flatten the list, extract the scores, and sum them all up
const calcVP = (turnData)=>turnData.map((t)=>t.missions).flat().map((m)=>m.score).reduce((a,c)=>a+c)

const armySelect = (vnode) => {
  let army = (vnode.attrs.army || {name: ''})
  return {
    view: () => [
      m('select.armySelect',
        {
          onchange: e => army.name = e.target.value,
          value: army.name,
          name: 'army',
          required: true,
        },
        m('option', {value:'',disabled: 'true', hidden:'true'}, 'choose your army'),
        armyList.map(x => m('option', x)),
       )
    ]
  }
}

const armySection = (vnode) => {
  let army = (vnode.attrs.army || {name: ''})
  return {
    view: () => [
      m('div#armyName',[
        m(armySelect, {army:army})
      ]),
      m('div#armyImage', [
        m('img', {src: `img/${(army.name || 'no-army' ).toLowerCase()}.png`})
      ])
      // <div id="armyName">
      //   Aeldari
      // </div>
      // <div id="army-image">
      //   <img src="img/aeldari.png">
      // </div>
      
    ]
  }
}

// const missionSelect = (vnode) => {
//   let mission = (vnode.attrs.mission || {name: ''})
//   return {
//     view: () => [
//       m('select.missionSelect',
//         {
//           onchange: e => mission.name = e.target.value,
//           value: mission.name,
//           name: 'mission',
//           required: true,
//         },
//         m('option', {value:'',disabled: 'true', hidden:'true'}, 'choose mission'),
//         missionList.map(x => m('option', x)),
//        )
//     ]
//   }
// }

const mission = (vnode) => {
  let mission = vnode.attrs.mission
  return {
    view: () => [
      mission.name,
      m('input.score',
        {
          onclick: () => { mission.score++ },
          oninput: (e) => { mission.score = e.target.value },
          value: mission.score,
        })
    ]
  }
}

const drawMission = (missionData) => {
  console.log(`drawMission - missionData: ${JSON.stringify(missionData)}`)
  missionData.push({name: missionList.pop(), score: 0})
}

const drawMissionButton = (vnode) => {
  let missionData = vnode.attrs.missionData
  // console.log(`drawMissionButton - ${JSON.stringify(vnode)}`)
  // console.log(`missionData: ${JSON.stringify(missionData)}`)
  return {
    view: () => [
      m('button', {onclick: () => drawMission(missionData)}, 'Draw Mission')
      // m('button',  'Draw Mission')
    ]
  }
}

const turnMissionSection = (vnode) => {
  let missionData = vnode.attrs.missions
  // console.log(`turnMissionSection - ${JSON.stringify(vnode)}`)
  // console.log(`missionData: ${JSON.stringify(missionData)}`)
  
  return {
    view: () => [
      m('div.mission', m(mission, {mission:missionData[0]})),
      m('div.mission', (missionData.length>1) ?
        m(mission, {mission:missionData[1]}) :
        m(drawMissionButton, {missionData:missionData})),
      m('div.mission', (missionData.length>2) ?
        m(mission, {mission:missionData[2]}) :
        m(drawMissionButton, {missionData:missionData})),
      
    ]
  }
}

const newTurnConfirm = m('.new-turn', 'new turn confirmation stuff here')

const newTurnModal = () => {
  return {
    view: () => [
      m('.newTurn modal is-active',
        m('.modal-background', { onclick: () => m.mount(document.getElementById('newTurnModal'), null) }),
        m('.modal-content', m('.box', newTurnConfirm)))
    ]
  }
}
const newTurn = (vnode) => {
  return {
    // view: () => m('p.turnNumber', { onclick: () => alert('foo') }, vnode.children)
    view: () => m('p.turnNumber',
                  { onclick: () => m.mount(document.getElementById('newTurnModal'), newTurnModal) },
                  vnode.children)
  }
}

const turnSection = (vnode) => {
  let view
  // console.log(`turnSection - ${JSON.stringify(vnode)}`)
  if (Object.hasOwn(vnode.attrs, 'turns')) {
    console.log(`turns: ${vnode.attrs.turns}`)
    view = () => [
    ]
  } else {
    console.log('turns empty')
  }
  
  return {
    view: () => [
      turnData.map((turn, index) => (
        m('div.turn',
          [
            (index > 0) ?
              m('p.turnNumber', `Turn ${turn.turnNumber}`) :
              [m('#newTurnModal'),
               m(newTurn, `Turn ${turn.turnNumber}`)],
            m(turnMissionSection, {missions: turn.missions})
          ]
         ))
                  )
    ]
  }
}

      
const turnListElement = document.getElementById('turnList');
const armyElement = document.getElementById('army');

let armyData = {name:''}

m.mount(armyElement, { view: () => m(armySection, { army: armyData }) })

// let component = { view: () => m(turnSection, { turns: turnData }) }
let component = { view: () => m(turnSection) }

shuffleArray(missionList)
m.mount(turnListElement, component)
