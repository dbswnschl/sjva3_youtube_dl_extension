chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab)=>{
    if (changeInfo.status === "complete"){
        
chrome.storage.sync.get((setting)=>{
    if(setting && setting.on_off === true){
        chrome.contextMenus.create({
            "id": "status_video",
            "title": "영상 정보",
            "documentUrlPatterns": [
                "http://*/*",
                "https://*/*"
            ]
        });
        chrome.contextMenus.create({
            "id": "download_video",
            "title": "영상 다운로드",
            "documentUrlPatterns": [
                "http://*/*",
                "https://*/*"
            ]
        });
        chrome.contextMenus.create({
            "id": "download_thumbnail",
            "title": "썸네일 다운로드",
            "documentUrlPatterns": [
                "http://*/*",
                "https://*/*"
            ]
        });
        chrome.contextMenus.create({
            "id": "download_subtitle",
            "title": "자막 다운로드",
            "documentUrlPatterns": [
                "http://*/*",
                "https://*/*"
            ]
        });
        chrome.contextMenus.create({
            "id": "list_video",
            "title": "다운로드 목록",
            "documentUrlPatterns": [
                "http://*/*",
                "https://*/*"
            ]
        });
        
    }else {
        chrome.contextMenus.removeAll(()=>{});
    }

    chrome.contextMenus.onClicked.addListener((info, tab) => {
        let menu_id = info.menuItemId;
        let pageUrl = info.pageUrl;
        if (!setting || !setting.target_url){
            chrome.notifications.create(menu_id+ new Date().now , {
                type: 'basic',
                title: '오류',
                iconUrl: 'icon.ico',
                message: `브라우저 상단 확장 프로그램 아이콘을 클릭하여 Sjva3 주소를 입력후 저장해주세요.`
            }, ()=>{

            })
            return false;
        }
        let endpoint = `${setting.target_url}/youtube-dl`;
        let n_id = menu_id+ new Date().now;

        let error_popup = (exc)=>{
            chrome.notifications.create(menu_id+ new Date().now , {
                type: 'basic',
                title: 'ERROR',
                iconUrl: 'icon.ico',
                message: `확장 프로그램의 아이콘을 눌러 환경설정의 주소와 포트번호를 확인해 주세요.\n에러내용 : ${exc}`
            }, ()=>{
            })
            console.error(exc);
        }
        let file_name = '';
        if (setting && setting.file_name){
            file_name = `&filename=${setting.file_name}`;
        }
        let select_extension_quality = '';
        if (setting && setting.select_extension_quality){
            select_extension_quality = `&format=${setting.select_extension_quality}`;
        }

        switch (menu_id) {
            case 'status_video':
                fetch(`${endpoint}/api/info_dict?plugin=test&url=${pageUrl}`, {
                    method: 'GET'
    
                }).then(res => res.text()).then(result => {
                    let j_obj = JSON.parse(result).info_dict;
                    let p_obj = {
                        title: j_obj.title,
                        upload_date: j_obj.upload_date,
                        uploader: j_obj.uploader,
                        view_count: j_obj.view_count,
                        duration: j_obj.duration,
                        format: j_obj.format,
                        ext: j_obj.ext,
                    }
                    chrome.notifications.create(menu_id+ new Date().now , {
                        type: 'basic',
                        title: '비디오 상태',
                        iconUrl: 'icon.ico',
                        message: `업로더/타이틀 : ${p_obj.uploader} / ${p_obj.title}\n길이 : ${p_obj.duration} 초\n업로드 시간 : ${p_obj.upload_date}\n포맷 : ${p_obj.format}`
                    }, ()=>{
                    })
                }).catch(exc=>{
                    error_popup(exc);
                });
                break;
            case 'download_video':
                fetch(`${endpoint}/api/download?plugin=sjva3_youtube_dl_extension&url=${pageUrl}&key=${pageUrl}&start=true${file_name}${select_extension_quality}`, {
                    method: 'GET'
                }).then(res=>res.text()).then(result => {
                    let j_obj = JSON.parse(result);
                    chrome.notifications.create(n_id , {
                        type: 'basic',
                        title: '다운로드 요청 결과',
                        iconUrl: 'icon.ico',
                        message: `결과 : ${j_obj.errorCode === 0 ? '성공' : '실패'}\n인덱스 : ${j_obj.index}`
                        
                    }, ()=>{});
                }).catch(exc=>{
                    error_popup(exc);
                });
                break;
            case 'download_thumbnail':
                fetch(`${endpoint}/api/thumbnail?plugin=sjva3_youtube_dl_extension&url=${pageUrl}&key=${pageUrl}&start=true${file_name}`, {
                    method: 'GET'
                }).then(res=>res.text()).then(result => {
                    let j_obj = JSON.parse(result);
                    chrome.notifications.create(n_id , {
                        type: 'basic',
                        title: '다운로드 요청 결과',
                        iconUrl: 'icon.ico',
                        message: `결과 : ${j_obj.errorCode === 0 ? '성공' : '실패'}\n인덱스 : ${j_obj.index}`
                        
                    }, ()=>{});
                }).catch(exc=>{
                    error_popup(exc);
                });;
                break;
            case 'download_subtitle':
                fetch(`${endpoint}/api/sub?plugin=sjva3_youtube_dl_extension&url=${pageUrl}&key=${pageUrl}&start=true${file_name}`, {
                    method: 'GET'
                }).then(res=>res.text()).then(result => {
                    let j_obj = JSON.parse(result);
                    chrome.notifications.create(n_id , {
                        type: 'basic',
                        title: '다운로드 요청 결과',
                        iconUrl: 'icon.ico',
                        message: `결과 : ${j_obj.errorCode === 0 ? '성공' : '실패'}\n인덱스 : ${j_obj.index}`
                        
                    }, ()=>{});
                }).catch(exc=>{
                    error_popup(exc);
                });;
                break;
            case 'list_video':
                chrome.tabs.create({url:`${endpoint}/list`});
                break;
            default:
                break;
        }
        chrome.notifications.onClicked.addListener((noti_id) => {
            if (noti_id.indexOf('download_') >= 0){
                chrome.tabs.create({url:`${endpoint}/list`});
                chrome.notifications.clear(noti_id);
            }
            chrome.notifications.getAll((items)=>{
                if (items){
                    for( let key in items) {
                        if (key.indexOf('sjva3_youtube_dl_extension')>=0){
                            chrome.notifications.clear(key);
                        }
                    }
                }
            });
    
        })

    });

});
    }
});


