
let get_setting = ()=>{
    chrome.storage.sync.get((data)=>{
        console.log(data);
        if (data && data.target_url){
            $('#input_extension_target_url').val(data.target_url);
        }
        if (data && data.file_name){
            $('#input_extension_filename').val(data.file_name);
        }
        if (data && data.select_extension_quality){
            $('#select_extension_quality').val(data.select_extension_quality);
        }
        if (data && data.on_off){
            $('#input_on_off').prop('checked', data.on_off);
        }

    })
}


window.onload = ()=>{

    $('#btn_extension_save').off('click').on('click',(evt)=>{
        let target_url = $('#input_extension_target_url').val();
        let file_name = $('#input_extension_filename').val();
        let select_extension_quality = $('#select_extension_quality').val();


        chrome.storage.sync.set( {target_url, file_name, select_extension_quality});
        console.log(target_url);
    });
    $('#input_on_off').off('change').on('change',(evt)=>{
        let on_off = $('#input_on_off').prop('checked');
        chrome.storage.sync.set({on_off});
    });

    get_setting();
    
};

