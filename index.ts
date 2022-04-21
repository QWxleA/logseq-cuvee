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
  // logseq.App.showMsg(`Toggled preview`)

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

async function csvQuery(block:BlockEntity, query:string, includePage:boolean) {
  logseq.App.showMsg(`Exporting CSV`)

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
  if (includePage) csvHeader.unshift("date")
  csvData.push(csvHeader)

  await logseq.DB.q(query).then((result) => {
    console.log("DB", result)
    result.map(n => {
      // console.log("DB ", n)
      let line = (includePage) ? [n.page.name] : []
      for (const prop of proplist) {
        line.push(n.properties[snakeToCamel(prop)])
        }
        csvData.push(line)
      });
  }); //FIXME error message
  let csvContent = csvData.map(e => e.join(",")).join("\n");
  downloadBlob(csvContent, 'export.csv', 'text/csv;charset=utf-8;')
}

const main = async () => {
  console.log(`Plugin: ${pluginName[1]} loaded`)

  logseq.useSettingsSchema(settingsTemplate)

  logseq.provideModel({
    async queryCSV (e: any) {
      const { blockUuid, query, includePage, slotId } = e.dataset
      console.log("DB e.dataset", e.dataset)
      if (slotId == "preview") await previewQuery(blockUuid, query)
      else await csvQuery(blockUuid, query, includePage)
    }})


  logseq.provideStyle(`
    .csv {
      background-color: pink;
    }
    .cuvee-btn {
       border: 1px solid var(--ls-border-color); 
       background-color: var(--ls-block-bullet-border-color);
       white-space: initial; 
       padding: 3px 4px; 
       border-radius: 4px; 
       user-select: none;
       cursor: default;
       display: flex;
       align-content: center;
       margin-right: 1em;
    }
    
    .cuvee-btn:hover {
      opacity: .8;
    }
    
    .cuvee-btn:active {
      opacity: .6;
    }
    
    .cuvee-btn.preview {
      padding: 3px 6px;
      cursor: zoom-in;
    }  
    .cuvee-btn.export {
      padding: 3px 6px;
      cursor: pointer;
    }  
    .cuvee {
      font-weight: bold;
      padding-top: 5px;
    }
    .cuvee-red {
      color: red;
    }
    .cuvee-green {
      color: green;
    }
    `)

  logseq.App.registerPageMenuItem(
    "Export CSV",
    exportCSV
  )

  logseq.Editor.registerSlashCommand('Cuvee: insert Export CSV button', async () => {
    await logseq.Editor.insertAtEditingCursor(`{{renderer ${pluginName[2]}, true, query}} `);
  });

  logseq.App.onMacroRendererSlotted(async ({ slot, payload }) => {
    try {
      // console.log("DB payload", payload)
      // console.log("DB payload", payload.arguments.length)
      let [type, includePage, query ] = payload.arguments
      includePage = JSON.parse(includePage) //convert too Boolean
      console.log("DB typeof", typeof includePage )
      if (type !== pluginName[2]) return
      const templYN = await onTemplate(payload.uuid)        
      const button = `
      <button
      class="cuvee-btn preview"
      data-slot-id="preview" 
      data-block-uuid="${payload.uuid}"
      data-query="${query}"
      data-on-click="queryCSV">
      🕵🏽‍♂️ Preview 
      </button>
      <button
      class="cuvee-btn export"
      data-slot-id="query" 
      data-block-uuid="${payload.uuid}"
      data-query="${query}"
      data-includePage="${includePage}"
      data-on-click="queryCSV">
      👩🏽‍💻 Export 
      </button> <span class="cuvee">CSV: ${query}</span>`
      let msg:string
      if (templYN === false && query != "query" && typeof includePage == "boolean") {
        msg = button
      } else { 
        // payload.arguments.length
        const dclass = (typeof includePage == "boolean") ? "cuvee-green" : "cuvee-red"
        const qclass = (query != "query") ? "cuvee-green" : "cuvee-red"
        const errmsg = (templYN === true) ? "This does not work in a template" : "<b>Error:</b> use: 'true/false' then a real query" 
        msg = `{{renderer ${pluginName[2]}, <span class="${dclass}">${includePage}</span>, <span class="${qclass}">${query}</span>}} ${errmsg}`
      }
          await logseq.provideUI({
          key: `${pluginName[0]}_a`,
          slot,
          template: msg,
          reset: true,
          style: { flex: 1 },
        })
        return 
  
    } catch (error) { console.log(error) }
  })
  }

logseq.ready(main).catch(console.error);
