export async function onTemplate(uuid){
    //is block(uuid) on a template?
    //returns boolean
    try {
      const block = await logseq.Editor.getBlock(uuid, {includeChildren: false})
      const checkTPL = (block.properties && block.properties.template != undefined) ? true : false
      const checkPRT = (block.parent != null && block.parent.id !== block.page.id)  ? true : false
  
      if (checkTPL === false && checkPRT === false) return false
      if (checkTPL === true )                       return true 
      return await onTemplate(block.parent.id) 
  
    } catch (error) { console.log(error) }
  }