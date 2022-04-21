import '@logseq/libs';
import { BlockEntity, BlockUUID } from '@logseq/libs/dist/LSPlugin';
//v0.0.1

export async function onTemplate(uuid:BlockUUID){
    //is block(uuid) on a template?
    //returns boolean
    try {
      const block:BlockEntity = await logseq.Editor.getBlock(uuid, {includeChildren: false})
      const checkTPL = (block.properties && block.properties.template != undefined) ? true : false
      const checkPRT = (block.parent != null && block.parent.id !== block.page.id)  ? true : false
  
      if (checkTPL === false && checkPRT === false) return false
      if (checkTPL === true )                       return true 
      return await onTemplate(block.parent.id) 
  
    } catch (error) { console.log(error) }
  }