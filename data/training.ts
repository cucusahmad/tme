export interface Training {

  id:number;

  title:string;

  provider:string;

  category:string;

  level:string;

  duration:string;

  rating:number;

  image:string;

  description:string;

  featured:boolean;

}

export const categories=[

"Semua",

"Artificial Intelligence",

"Leadership",

"Digital",

"Communication",

"Public Service",

"Programming",

"Data Analytics",

];

export const trainings:Training[]=[

{
id:1,
title:"Artificial Intelligence for Public Service",
provider:"PediLearn",
category:"Artificial Intelligence",
level:"Beginner",
duration:"16 JP",
rating:4.9,
image:"/images/training/ai.png",
description:"Belajar AI untuk pelayanan publik.",
featured:true,
},

{
id:2,
title:"Leadership for Future Leader",
provider:"Universitas Bandar Lampung",
category:"Leadership",
level:"Intermediate",
duration:"24 JP",
rating:4.8,
image:"/images/training/leadership.png",
description:"Membangun jiwa kepemimpinan ASN.",
featured:true,
},

{
id:3,
title:"Public Speaking Professional",
provider:"PediLearn",
category:"Communication",
level:"Beginner",
duration:"8 JP",
rating:4.7,
image:"/images/training/public-speaking.png",
description:"Meningkatkan kemampuan komunikasi.",
featured:false,
},

{
id:4,
title:"Digital Transformation",
provider:"Universitas Bandar Lampung",
category:"Digital",
level:"Intermediate",
duration:"20 JP",
rating:4.8,
image:"/images/training/digital.png",
description:"Transformasi digital organisasi.",
featured:false,
},

{
id:5,
title:"Data Analytics With Excel",
provider:"Coursera",
category:"Data Analytics",
level:"Intermediate",
duration:"18 JP",
rating:4.9,
image:"/images/training/excel.png",
description:"Analisis data menggunakan Excel.",
featured:false,
},

{
id:6,
title:"Python Programming",
provider:"Udemy",
category:"Programming",
level:"Beginner",
duration:"30 JP",
rating:4.8,
image:"/images/training/phyton.png",
description:"Pemrograman Python dari dasar.",
featured:false,
},

];