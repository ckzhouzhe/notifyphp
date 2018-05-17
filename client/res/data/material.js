var materialList = [
    {
      "cs_id": "6",
      "cs_name": "跟读测试课程——新版",
      "en_cs_name": "test new",
      "cs_img": "http://pic2.ooopic.com/12/61/94/59bOOOPIC3c_1024.jpg",
      "intro": "",
      "status": "1",
      "grade": "1",
      "category_id": "2",
      "create_time": "1477970518",
      "update_time": "1477973042",
      "book_url": "",
      "plan_num": 3,
      "read_num": 1,
      "flower_num": 1,
      "join_time": 1478167802,
      "finish_status": 0
    },
    {
      "cs_id": "2",
      "cs_name": "超级飞侠暑假班",
      "en_cs_name": "superwings",
      "cs_img": "http://pic2.ooopic.com/12/61/94/59bOOOPIC3c_1024.jpg",
      "intro": "",
      "status": "1",
      "grade": "1",
      "category_id": "1",
      "create_time": "1473072167",
      "update_time": "1473072167",
      "book_url": "",
      "plan_num": 3,
      "read_num": 3,
      "flower_num": 3,
      "join_time": 1476806400,
      "finish_status": 1
    },
    {
      "cs_id": "3",
      "cs_name": "超级飞侠寒假班",
      "en_cs_name": "winter class",
      "cs_img": "http://pic2.ooopic.com/12/61/94/59bOOOPIC3c_1024.jpg",
      "intro": "winter class",
      "status": "1",
      "grade": "1",
      "category_id": "1",
      "create_time": "1473072177",
      "update_time": "1473249774",
      "book_url": "",
      "plan_num": 88,
      "read_num": 2,
      "flower_num": 2,
      "join_time": 1476720000,
      "finish_status": 0
    },
    {
      "cs_id": "1",
      "cs_name": "超级飞侠跟读课程",
      "en_cs_name": "superwings",
      "cs_img": "http://pic2.ooopic.com/12/61/94/59bOOOPIC3c_1024.jpg",
      "intro": "",
      "status": "1",
      "grade": "2",
      "category_id": "1",
      "create_time": "1473076256",
      "update_time": "1476782486",
      "book_url": "",
      "plan_num": 0,
      "read_num": 0,
      "flower_num": 0,
      "join_time": 0,
      "finish_status": -1
    },
    {
      "cs_id": "5",
      "cs_name": "APP跟读第一套教材",
      "en_cs_name": "app material 1",
      "cs_img": "",
      "intro": "app material 1",
      "status": "1",
      "grade": "4",
      "category_id": "4",
      "create_time": "1477021810",
      "update_time": "1478077190",
      "book_url": "http://pic2.ooopic.com/12/61/94/59bOOOPIC3c_1024.jpg",
      "plan_num": 0,
      "read_num": 0,
      "flower_num": 0,
      "join_time": 0,
      "finish_status": -1
    }
  ]
var readingInfo=[
  {
    img_url:'http://www.wxapp-union.com/data/attachment/forum/201611/15/002813jgbfz22t8tgkvvu3.jpg',
    
    audio_url:'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=46',
    resource_en_content:'sdf',
    resource_content:'sfd',
    audio_duration:'5'
  },
  {
    img_url:'http://www.wxapp-union.com/data/attachment/forum/201611/15/002813jgbfz22t8tgkvvu3.jpg',
    
    audio_url:'http://data.5sing.kgimg.com/G129/M08/1E/13/IYcBAFqidV6AQJdgAG-PfUukX4Y663.mp3',
    resource_en_content:'sdf',
    resource_content:'sfd',
    audio_duration:'5'
  }
]
var recordList=[
  {
    user_portrait:'http://www.wxapp-union.com/data/attachment/forum/201611/15/002813jgbfz22t8tgkvvu3.jpg',
    user_name:'data',
    full_audio_url:'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=46',
    create_time_show:'2018-08-08'
  },
  {
    user_portrait:'http://www.wxapp-union.com/data/attachment/forum/201611/15/002813jgbfz22t8tgkvvu3.jpg',
    user_name:'data',
    full_audio_url:'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=46',
    create_time_show:'2018-08-08'
  }
]

module.exports = {  
  materialList: materialList,
  readingInfo:readingInfo,
  recordList:recordList
} 