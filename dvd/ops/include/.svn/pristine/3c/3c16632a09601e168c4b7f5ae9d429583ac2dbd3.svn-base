(() => {
  function getLocalData() {
    const hrefArray = location.href.split('.html')[0].split('/');
    const fileName = hrefArray[hrefArray.length - 1];

    let type;
    //추가 ========================20211125
    if( parent.content_etc == 1 ) 
      type = "contents_sub";
    else
      type = hrefArray.filter((text) => text.includes('_sub')).length > 0 ? 'contents_sub' : 'contents';

    return {
      grade: fileName.split('')[1] - 0,
      term: fileName.split('')[2] - 0,
      type: type
    };
  }
  
  const WRAP = $ic.getEl('#wrap');
  const localData = getLocalData();
  const grade = localData.grade;
  const term = localData.term;
  const type = localData.type;

  function setHeader() {
    $ic.createEl({
      tag: 'header',
      parent: WRAP.DOM,
      callback: (header) => {
        $ic.createEl({
          tag: 'iframe',
          parent: header,
          callback: (iframe) => {
            iframe.src = `./include/toc/${grade}_${term}_${type}_toc.html`;
          }
        });
      }
    });
  }

  $ic.createEl({
    tag: 'script',
    callback: (script) => {
      script.src = `./include/toc/${grade}_${term}_${type}_toc.js`;
      script.onload = () => {
        setHeader();
      }
    }
  });
})();