import '@logseq/libs';
import { SettingSchemaDesc, BlockEntity } from '@logseq/libs/dist/LSPlugin';

import { onTemplate } from "./qwutils";


const pluginName = ["logseq-cuvee", "Logseq Cuvée",":cuvee"]
const reProperty:RegExp = /\(property (.*?)\)/gm

let settingsTemplate: SettingSchemaDesc[] = [  
  {
    key: "emoji",
    type: 'string',
    default: "⏱",
    title: "Note taking Emoji",
    description: "Emoji printed when transcribing video",
  }]

function downloadBlob(content, filename, contentType) {
  // Create a blob
  var blob = new Blob([content], { type: contentType });
  var url = URL.createObjectURL(blob);

  // Create a link to download it
  var pom = document.createElement('a');
  pom.href = url;
  pom.setAttribute('download', filename);
  pom.click();
}

//retired
//Inputs 5 numbered blocks when called
async function exportCSV (e) {
  console.log('Export CSV!')
  const rows = [
    ["name1", "city1", "some other info"],
    ["name2", "city2", "more info"]
  ];
  console.log("DB", rows)
  let csvContent = "data:text/csv;charset=utf-8," 
    + rows.map(e => e.join(",")).join("\n")
  // let numberArray = [1, 2, 3, 4, 5]
  // for (const number in numberArray){
  console.log("DB", csvContent)

  logseq.App.showMsg("Function has been run")
  console.log("DB finished")
  downloadBlob(csvContent, 'export.csv', 'text/csv;charset=utf-8;')
}

async function previewQuery(blockUuid:BlockEntity, query:string) {
  logseq.App.showMsg(`Toggled preview`)

  // preview property, so we don't insert loads of blocks
  const newContent = `{{query ${query}}}`
  let nextBlock:BlockEntity = await logseq.Editor.getNextSiblingBlock(blockUuid)
  console.log("DB", nextBlock)
  if (nextBlock?.properties?.preview) { 
    await logseq.Editor.updateBlock(nextBlock.uuid, newContent)
  } else  {
    await logseq.Editor.insertBlock(blockUuid, newContent)
  }
  nextBlock = await logseq.Editor.getNextSiblingBlock(blockUuid)

  //FIXME separate function?
  const proplist = getProplist(reProperty,query)
  let queryProperties = "["
  for (const prop of proplist) {
    queryProperties += `:${prop} `
  }
  queryProperties += "]"

  //preview is used to not add tables 'sine fine'
  logseq.Editor.upsertBlockProperty(nextBlock.uuid, "preview", true); 
  logseq.Editor.upsertBlockProperty(nextBlock.uuid, "query-table", true); 
  logseq.Editor.upsertBlockProperty(nextBlock.uuid, "query-properties", queryProperties); 

}

function getProplist(regex:RegExp, query:string) {
  const properties = query.matchAll(regex);
  let proplist = []
  for (const prop of properties) { proplist.push(prop[1]) }
  console.log("DB getProplist", proplist)
  return proplist
}

async function csvQuery(block:BlockEntity, query:string) {
  logseq.App.showMsg(`Toggled csv`)

  //parse query
  //(and [[testday]] (property total-hours) (property restful-hours) )
  // const reTag:RegExp      = /\[\[(.*?)\]\]/gm
  
  const snakeToCamel = str =>
  str.toLowerCase().replace(/([-_][a-z])/g, group =>
  group
  .toUpperCase()
  .replace('-', '')
  .replace('_', '')
  );

  const proplist = getProplist(reProperty, query)

  //FIXME csvData - date is ugly!
  let csvData = []
  let csvHeader = []
  csvHeader.push(proplist)
  csvHeader.unshift("date")
  csvData.push(csvHeader)

  await logseq.DB.q(query).then((result) => {
    const doubled = result.map(n => {
      // console.log("DB 0.1 n:", n)
      let line = [n.page.name]
      // console.log("DB 1. line", line)
      // console.log("DB 0.3 proplist:", proplist)
      for (const prop of proplist) {
        // console.log("DB 1. prop", prop)
        line.push(n.properties[snakeToCamel(prop)])
        }
        console.log("DB line", line)
        csvData.push(line)
        // return ret 
      });
    // csvData.push(doubled)
    console.log("DB csv", csvData)
    // console.log("DB 4. 2x", doubled)
  }); //FIXME error message
  let csvContent = csvData.map(e => e.join(",")).join("\n");
  downloadBlob(csvContent, 'export.csv', 'text/csv;charset=utf-8;')
}

const main = async () => {
  console.log(`Plugin: ${pluginName[1]} loaded`)

  logseq.useSettingsSchema(settingsTemplate)

  logseq.provideModel({
    async queryCSV (e: any) {
      const { blockUuid, query, slotId } = e.dataset
      console.log("DB e.dataset", e.dataset)
      if (slotId == "preview") await previewQuery(blockUuid, query)
      else await csvQuery(blockUuid, query)
    }})


  logseq.provideStyle(`
    .csv {
      background-color: pink;
    }
    .pomodoro-timer-btn {
       border: 1px solid var(--ls-border-color); 
       white-space: initial; 
       padding: 3px 4px; 
       border-radius: 4px; 
       user-select: none;
       cursor: default;
       display: flex;
       align-content: center;
       margin-right: 1em;
    }
    
    .pomodoro-timer-btn.is-start:hover {
      opacity: .8;
    }
    
    .pomodoro-timer-btn.is-start:active {
      opacity: .6;
    }
    
    .pomodoro-timer-btn.is-start {
      padding: 3px 6px;
      cursor: pointer;
    }
    
    .pomodoro-timer-btn.is-pending {
      padding-left: 6px;
      width: 84px;
      background-color: #f6dbdb;
      border-color: #edbdbd;
      color: #cd3838;
    }
    
    .pomodoro-timer-btn.is-done {
      width: auto;
      background-color: #defcf0;
      border-color: #9ddbc7;
      color: #0F9960;
    }
  `)

  logseq.App.registerPageMenuItem(
    "Export CSV",
    exportCSV
  )

  logseq.Editor.registerSlashCommand('Cuvee: insert Export CSV button', async () => {
    await logseq.Editor.insertAtEditingCursor(`{{renderer ${pluginName[2]}, query}} `);
  });

  logseq.App.onMacroRendererSlotted(async ({ slot, payload }) => {
    try {
      let [type, query ] = payload.arguments
      if (type !== pluginName[2]) return
      const templYN = await onTemplate(payload.uuid)        
      const button = `
      <button
      class="pomodoro-timer-btn is-start"
      data-slot-id="preview" 
      data-block-uuid="${payload.uuid}"
      data-query="${query}"
      data-on-click="queryCSV">
      👩🏽‍💻 Preview 
      </button>
      <button
      class="pomodoro-timer-btn is-start"
      data-slot-id="query" 
      data-block-uuid="${payload.uuid}"
      data-query="${query}"
      data-on-click="queryCSV">
      👩🏽‍💻 Export 
      </button> <b>CSV: ${query}</b>`
      if (templYN === false || ! query == "query") { 
          await logseq.provideUI({
          key: `${pluginName[0]}_a`,
          slot,
          template: button,
          reset: true,
          style: { flex: 1 },
        })
        return 
      }
      else { 
        // const nblock = await logseq.Editor.getBlock(uuid);
        // if (!nblock.properties?.id) { logseq.Editor.upsertBlockProperty(nblock.uuid, "id", nblock.uuid); }
        let msg = (query == "query") ? "Replace 'query' with an *actual* query" : "This does not work in a template"
        await logseq.Editor.updateBlock(payload.uuid, msg) 
      }  
    } catch (error) { console.log(error) }
  })
  }

logseq.ready(main).catch(console.error);
