const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./model/blog.db');
db.serialize(() => {
	db.run(
		`CREATE TABLE IF NOT EXISTS
            posts(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                author VARCHAR(100) NOT NULL,
                title VARCHAR(100) NOT NULL,
                content TEXT NOT NULL,
                created_at TEXT NOT NULL,
                slug VARCHAR(100) NOT NULL,
                published_at VARCHAR(100),
                modified_at VARCHAR(100),
                draft INTEGER NOT NULL
                )`
	);

	db.run(`
        INSERT
        INTO
        posts(title, author, content, created_at, slug, draft, published_at, modified_at)
        VALUES("Build a Simple Chat App with Node.js and Socket.io",
            "Paolo",
            "
            Aenean rutrum lobortis facilisis. Aliquam in mi id erat elementum egestas. Curabitur volutpat mattis ante at dignissim. Fusce at viverra risus. Curabitur ac aliquet leo. Donec nisl neque, volutpat a nisl tincidunt, mattis rhoncus urna. Cras leo nibh, pellentesque id auctor at, dignissim quis lacus.

            Proin neque lectus, molestie vel eleifend a, ultricies rhoncus tellus. Cras id pharetra risus, vitae auctor felis. Vestibulum fermentum pellentesque porttitor. Vestibulum in arcu semper, efficitur orci non, blandit turpis. Etiam a augue faucibus ipsum egestas vulputate. Duis volutpat placerat massa, a tempus neque bibendum sed. Integer eu purus a lacus elementum cursus. Nunc faucibus nunc urna, ut hendrerit ante pulvinar quis. Suspendisse tincidunt aliquam eros, at feugiat dolor tempor ac. Praesent maximus vestibulum quam, ut sollicitudin eros elementum non.

            Vivamus eros dolor, venenatis a maximus malesuada, maximus et dolor. Nam a sodales purus. Sed mattis eros vel mauris tristique dapibus. Nunc dictum auctor mollis. Sed non varius ipsum. Sed ac pharetra tellus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. In ac sagittis lorem. Praesent dolor massa, auctor sit amet massa ac, interdum ultricies lorem. Pellentesque id quam elementum odio fermentum accumsan. Aenean ut odio fringilla, vehicula dolor vel, feugiat diam.
            ",
            "2020-03-22 11:55:43",
            "build-a-simple-chat-app",
            0,
            "2020-04-09 10:15:45",
            "2020-04-09 10:10:45"
    )
    `);

	db.run(`
        INSERT
        INTO
        posts(title, author, content, created_at, slug, draft, published_at, modified_at)
        VALUES("React Data Fetching",
            "Justin",
            "
            Proin et consequat orci. Sed pretium nulla ac porta hendrerit. Morbi ut nisi eget orci finibus rutrum. Suspendisse eget dui placerat, aliquam quam nec, egestas erat. Donec eu sagittis odio, eget varius quam. Etiam mattis in purus eleifend varius. Vivamus venenatis nec sem ut blandit. Cras posuere interdum eros, id interdum ligula egestas vel. Nullam purus lorem, consequat sit amet bibendum maximus, cursus a leo.

            Quisque viverra sodales rutrum. Vestibulum ac ante vel odio blandit placerat in in sem. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Curabitur rutrum, felis eget dapibus vulputate, leo risus laoreet mauris, a facilisis magna nulla eu odio. Vestibulum ante tortor, eleifend nec gravida ut, interdum at nulla. Cras sit amet porta metus, ac placerat sapien. Morbi vehicula orci nulla, eu convallis risus malesuada eget. Sed commodo aliquet ante id euismod.
            ",
            "2019-12-23 09:46:12",
            "react-data-fetching",
            1,
            "",
            "2019-12-23 09:46:12"
    )
`);

	db.run(`
        INSERT
        INTO
        posts(title, author, content, created_at, slug, draft, published_at, modified_at)
        VALUES("Better frontend development with inspiration from the culinary world",
            "Ryan",
            "
            Vestibulum ante tortor, eleifend nec gravida ut, interdum at nulla. Cras sit amet porta metus, ac placerat sapien. Morbi vehicula orci nulla, eu convallis risus malesuada eget. Sed commodo aliquet ante id euismod.

            Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Cras eleifend iaculis risus eu lobortis. Mauris sit amet elit non felis maximus vestibulum id hendrerit orci. Suspendisse potenti. Nam justo lectus, eleifend at tortor non, vulputate finibus neque. Maecenas scelerisque, massa ac congue fringilla, nulla neque aliquet diam, sed malesuada tortor felis id risus. Nunc accumsan nulla sed turpis interdum lobortis. Integer a mattis orci. Duis accumsan eleifend neque egestas rutrum. Curabitur eget rhoncus magna. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
            
            Etiam aliquet maximus lectus tincidunt pulvinar. Praesent gravida arcu quis diam dignissim, vitae pharetra lorem sagittis. Praesent vel tellus ipsum. Sed vestibulum augue vel nisi vehicula, sed fringilla est aliquam. Quisque volutpat felis at interdum fermentum. Praesent vestibulum egestas urna ut ullamcorper. Pellentesque dui nulla, malesuada consequat dictum vel, accumsan id odio. Nunc commodo erat vitae eros interdum, id fermentum sapien hendrerit. Nam at mi turpis.
            ",
            "2020-01-11 10:22:34",
            "better-frontend-development",
            0,
            "2020-01-11 10:22:34",
            "2020-01-11 10:22:34"
        )
`);

	db.run(`
        INSERT
        INTO
        posts(title, author, content, created_at, slug, draft, published_at, modified_at)
        VALUES("A Minimalistic Web Portfolio for all devs",
            "Sivanesh",
            "
            Phasellus eu quam ac tellus varius semper ac eget ex. Praesent sagittis pulvinar turpis, a ultricies mi mollis blandit. Pellentesque a nunc at dui molestie sodales eu in turpis. Sed at arcu vitae urna maximus condimentum non id mi. Donec congue nulla at tellus tincidunt venenatis. Mauris tristique neque iaculis, dapibus tortor a, ultrices felis. Donec et leo dolor. Aliquam ac erat a lectus ultricies interdum eu et libero. Vestibulum mollis ex ac euismod tincidunt. Sed id viverra orci. Integer elementum congue orci. Nam vel ex dignissim, volutpat libero et, tempus libero. Curabitur laoreet hendrerit imperdiet. Praesent tincidunt iaculis diam eu tincidunt.

            Donec vel metus diam. Integer id finibus urna. Nam sit amet porttitor libero. Quisque vestibulum, mauris sed consectetur viverra, felis tortor pellentesque justo, quis tristique sapien quam ut massa. Curabitur vel euismod lacus. Quisque lacus lectus, feugiat sit amet ultricies et, interdum id eros. Vivamus quis porttitor ante. In hac habitasse platea dictumst. Sed laoreet rutrum sapien sed ullamcorper. Ut tincidunt tincidunt ornare. In interdum dignissim lectus id blandit. Nulla elementum quam sit amet accumsan dapibus. Nullam nec ex at ante efficitur suscipit.
            
            Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris et ipsum at metus cursus laoreet in vulputate quam. Sed pulvinar ornare orci vitae laoreet. Pellentesque interdum odio id lorem maximus fringilla. In quis leo sed leo malesuada aliquam. Vivamus tristique vitae urna quis eleifend. Curabitur nec fringilla lacus. Vestibulum id sapien sagittis, bibendum purus ut, sagittis quam. Nunc ipsum est, placerat tristique congue vel, semper vel eros. Fusce quis scelerisque lacus.
            ",
            "2019-12-25 09:46:12",
            "minimalistic-web-portfolio",
            0,
            "2019-12-25 09:46:12",
            "2019-12-26 09:46:12"
        )
`);

	db.run(`
        INSERT
        INTO
        posts(title, author, content, created_at, slug, draft, published_at, modified_at)
        VALUES("React: Context",
            "Karl",
            "
            Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Cras eleifend iaculis risus eu lobortis. Mauris sit amet elit non felis maximus vestibulum id hendrerit orci. Suspendisse potenti. Nam justo lectus, eleifend at tortor non, vulputate finibus neque. Maecenas scelerisque, massa ac congue fringilla, nulla neque aliquet diam, sed malesuada tortor felis id risus. Nunc accumsan nulla sed turpis interdum lobortis. Integer a mattis orci. Duis accumsan eleifend neque egestas rutrum. Curabitur eget rhoncus magna. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.

            Etiam aliquet maximus lectus tincidunt pulvinar. Praesent gravida arcu quis diam dignissim, vitae pharetra lorem sagittis. Praesent vel tellus ipsum. Sed vestibulum augue vel nisi vehicula, sed fringilla est aliquam. Quisque volutpat felis at interdum fermentum. Praesent vestibulum egestas urna ut ullamcorper. Pellentesque dui nulla, malesuada consequat dictum vel, accumsan id odio. Nunc commodo erat vitae eros interdum, id fermentum sapien hendrerit. Nam at mi turpis.
            
            Phasellus eu quam ac tellus varius semper ac eget ex. Praesent sagittis pulvinar turpis, a ultricies mi mollis blandit. Pellentesque a nunc at dui molestie sodales eu in turpis. Sed at arcu vitae urna maximus condimentum non id mi. Donec congue nulla at tellus tincidunt venenatis. Mauris tristique neque iaculis, dapibus tortor a, ultrices felis. Donec et leo dolor. Aliquam ac erat a lectus ultricies interdum eu et libero. Vestibulum mollis ex ac euismod tincidunt. Sed id viverra orci. Integer elementum congue orci. Nam vel ex dignissim, volutpat libero et, tempus libero. Curabitur laoreet hendrerit imperdiet. Praesent tincidunt iaculis diam eu tincidunt.
            ",
            "2020-01-12 11:24:37",
            "react-context",
            0,
            "2020-01-12 11:24:37",
            "2020-01-12 11:24:37"
        )
`);

	db.run(`
        INSERT
        INTO
        posts(title, author, content, created_at, slug, draft, published_at, modified_at)
        VALUES("Building layouts with flexbox",
            "Manan",
            "
            Quisque viverra sodales rutrum. Vestibulum ac ante vel odio blandit placerat in in sem. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Curabitur rutrum, felis eget dapibus vulputate, leo risus laoreet mauris, a facilisis magna nulla eu odio. Vestibulum ante tortor, eleifend nec gravida ut, interdum at nulla. Cras sit amet porta metus, ac placerat sapien. Morbi vehicula orci nulla, eu convallis risus malesuada eget. Sed commodo aliquet ante id euismod.

            Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Cras eleifend iaculis risus eu lobortis. Mauris sit amet elit non felis maximus vestibulum id hendrerit orci. Suspendisse potenti. Nam justo lectus, eleifend at tortor non, vulputate finibus neque. Maecenas scelerisque, massa ac congue fringilla, nulla neque aliquet diam, sed malesuada tortor felis id risus. Nunc accumsan nulla sed turpis interdum lobortis. Integer a mattis orci. Duis accumsan eleifend neque egestas rutrum. Curabitur eget rhoncus magna. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
            ",
            "2020-03-15 09:12:57",
            "flexbox-layouts",
            0,
            "2020-03-15 09:12:57",
            "2020-03-15 09:12:57"
        )
`);

	db.run(`
        INSERT
        INTO
        posts(title, author, content, created_at, slug, draft, published_at, modified_at)
        VALUES("Best way to improve your React code",
            "Narender",
            "
            Quisque viverra sodales rutrum. Vestibulum ac ante vel odio blandit placerat in in sem. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Curabitur rutrum, felis eget dapibus vulputate, leo risus laoreet mauris, a facilisis magna nulla eu odio. Vestibulum ante tortor, eleifend nec gravida ut, interdum at nulla. Cras sit amet porta metus, ac placerat sapien. Morbi vehicula orci nulla, eu convallis risus malesuada eget. Sed commodo aliquet ante id euismod.

            Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Cras eleifend iaculis risus eu lobortis. Mauris sit amet elit non felis maximus vestibulum id hendrerit orci. Suspendisse potenti. Nam justo lectus, eleifend at tortor non, vulputate finibus neque. Maecenas scelerisque, massa ac congue fringilla, nulla neque aliquet diam, sed malesuada tortor felis id risus. Nunc accumsan nulla sed turpis interdum lobortis. Integer a mattis orci. Duis accumsan eleifend neque egestas rutrum. Curabitur eget rhoncus magna. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
            
            Etiam aliquet maximus lectus tincidunt pulvinar. Praesent gravida arcu quis diam dignissim, vitae pharetra lorem sagittis. Praesent vel tellus ipsum. Sed vestibulum augue vel nisi vehicula, sed fringilla est aliquam. Quisque volutpat felis at interdum fermentum. Praesent vestibulum egestas urna ut ullamcorper. Pellentesque dui nulla, malesuada consequat dictum vel, accumsan id odio. Nunc commodo erat vitae eros interdum, id fermentum sapien hendrerit. Nam at mi turpis.
            ",
            "2020-02-24 12:32:56",
            "improve-your-react-code",
            0,
            "2020-02-24 12:32:56",
            "2020-02-24 12:32:56"
        )
`);

	db.run(`
        INSERT
        INTO
        posts(title, author, content, created_at, slug, draft, published_at, modified_at)
        VALUES("Server side rendering versus JS",
            "Ryan",
            "
            Aenean rutrum lobortis facilisis. Aliquam in mi id erat elementum egestas. Curabitur volutpat mattis ante at dignissim. Fusce at viverra risus. Curabitur ac aliquet leo. Donec nisl neque, volutpat a nisl tincidunt, mattis rhoncus urna. Cras leo nibh, pellentesque id auctor at, dignissim quis lacus.

            Proin neque lectus, molestie vel eleifend a, ultricies rhoncus tellus. Cras id pharetra risus, vitae auctor felis. Vestibulum fermentum pellentesque porttitor. Vestibulum in arcu semper, efficitur orci non, blandit turpis. Etiam a augue faucibus ipsum egestas vulputate. Duis volutpat placerat massa, a tempus neque bibendum sed. Integer eu purus a lacus elementum cursus. Nunc faucibus nunc urna, ut hendrerit ante pulvinar quis. Suspendisse tincidunt aliquam eros, at feugiat dolor tempor ac. Praesent maximus vestibulum quam, ut sollicitudin eros elementum non.
            
            Vivamus eros dolor, venenatis a maximus malesuada, maximus et dolor. Nam a sodales purus. Sed mattis eros vel mauris tristique dapibus. Nunc dictum auctor mollis. Sed non varius ipsum. Sed ac pharetra tellus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. In ac sagittis lorem. Praesent dolor massa, auctor sit amet massa ac, interdum ultricies lorem. Pellentesque id quam elementum odio fermentum accumsan. Aenean ut odio fringilla, vehicula dolor vel, feugiat diam.
            
            Proin et consequat orci. Sed pretium nulla ac porta hendrerit. Morbi ut nisi eget orci finibus rutrum. Suspendisse eget dui placerat, aliquam quam nec, egestas erat. Donec eu sagittis odio, eget varius quam. Etiam mattis in purus eleifend varius. Vivamus venenatis nec sem ut blandit. Cras posuere interdum eros, id interdum ligula egestas vel. Nullam purus lorem, consequat sit amet bibendum maximus, cursus a leo.
            
            Quisque viverra sodales rutrum. Vestibulum ac ante vel odio blandit placerat in in sem. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Curabitur rutrum, felis eget dapibus vulputate, leo risus laoreet mauris, a facilisis magna nulla eu odio. Vestibulum ante tortor, eleifend nec gravida ut, interdum at nulla. Cras sit amet porta metus, ac placerat sapien. Morbi vehicula orci nulla, eu convallis risus malesuada eget. Sed commodo aliquet ante id euismo
            ",
            "2020-03-01 19:57:43",
            "server-side-render-vs-js",
            1,
            "",
            "2020-03-01 19:57:43"
        )
`);

	db.run(`
        INSERT
        INTO
        posts(title, author, content, created_at, slug, draft, published_at, modified_at)
        VALUES("Day 2 in Web Development",
            "Xalman",
            "
            Etiam aliquet maximus lectus tincidunt pulvinar. Praesent gravida arcu quis diam dignissim, vitae pharetra lorem sagittis. Praesent vel tellus ipsum. Sed vestibulum augue vel nisi vehicula, sed fringilla est aliquam. Quisque volutpat felis at interdum fermentum. Praesent vestibulum egestas urna ut ullamcorper. Pellentesque dui nulla, malesuada consequat dictum vel, accumsan id odio. Nunc commodo erat vitae eros interdum, id fermentum sapien hendrerit. Nam at mi turpis.

            Phasellus eu quam ac tellus varius semper ac eget ex. Praesent sagittis pulvinar turpis, a ultricies mi mollis blandit. Pellentesque a nunc at dui molestie sodales eu in turpis. Sed at arcu vitae urna maximus condimentum non id mi. Donec congue nulla at tellus tincidunt venenatis. Mauris tristique neque iaculis, dapibus tortor a, ultrices felis. Donec et leo dolor. Aliquam ac erat a lectus ultricies interdum eu et libero. Vestibulum mollis ex ac euismod tincidunt. Sed id viverra orci. Integer elementum congue orci. Nam vel ex dignissim, volutpat libero et, tempus libero. Curabitur laoreet hendrerit imperdiet. Praesent tincidunt iaculis diam eu tincidunt.
            
            Donec vel metus diam. Integer id finibus urna. Nam sit amet porttitor libero. Quisque vestibulum, mauris sed consectetur viverra, felis tortor pellentesque justo, quis tristique sapien quam ut massa. Curabitur vel euismod lacus. Quisque lacus lectus, feugiat sit amet ultricies et, interdum id eros. Vivamus quis porttitor ante. In hac habitasse platea dictumst. Sed laoreet rutrum sapien sed ullamcorper. Ut tincidunt tincidunt ornare. In interdum dignissim lectus id blandit. Nulla elementum quam sit amet accumsan dapibus. Nullam nec ex at ante efficitur suscipit.
            
            Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris et ipsum at metus cursus laoreet in vulputate quam. Sed pulvinar ornare orci vitae laoreet. Pellentesque interdum odio id lorem maximus fringilla. In quis leo sed leo malesuada aliquam. Vivamus tristique vitae urna quis eleifend. Curabitur nec fringilla lacus. Vestibulum id sapien sagittis, bibendum purus ut, sagittis quam. Nunc ipsum est, placerat tristique congue vel, semper vel eros. Fusce quis scelerisque lacus.
            ",
            "2019-11-19 18:57:12",
            "day-two-in-web-dev",
            0,
            "2019-11-19 18:57:12",
            "2019-11-19 18:57:12"
        )
`);

	db.run(`
        INSERT
        INTO
        posts(title, author, content, created_at, slug, draft, published_at, modified_at)
        VALUES("4 Essential ESLint Plugins You Need in Your React Setup",
            "Roberto",
            "
            Quisque viverra sodales rutrum. Vestibulum ac ante vel odio blandit placerat in in sem. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Curabitur rutrum, felis eget dapibus vulputate, leo risus laoreet mauris, a facilisis magna nulla eu odio. Vestibulum ante tortor, eleifend nec gravida ut, interdum at nulla. Cras sit amet porta metus, ac placerat sapien. Morbi vehicula orci nulla, eu convallis risus malesuada eget. Sed commodo aliquet ante id euismod.

            Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Cras eleifend iaculis risus eu lobortis. Mauris sit amet elit non felis maximus vestibulum id hendrerit orci. Suspendisse potenti. Nam justo lectus, eleifend at tortor non, vulputate finibus neque. Maecenas scelerisque, massa ac congue fringilla, nulla neque aliquet diam, sed malesuada tortor felis id risus. Nunc accumsan nulla sed turpis interdum lobortis. Integer a mattis orci. Duis accumsan eleifend neque egestas rutrum. Curabitur eget rhoncus magna. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
            
            Etiam aliquet maximus lectus tincidunt pulvinar. Praesent gravida arcu quis diam dignissim, vitae pharetra lorem sagittis. Praesent vel tellus ipsum. Sed vestibulum augue vel nisi vehicula, sed fringilla est aliquam. Quisque volutpat felis at interdum fermentum. Praesent vestibulum egestas urna ut ullamcorper. Pellentesque dui nulla, malesuada consequat dictum vel, accumsan id odio. Nunc commodo erat vitae eros interdum, id fermentum sapien hendrerit. Nam at mi turpis.
            
            Phasellus eu quam ac tellus varius semper ac eget ex. Praesent sagittis pulvinar turpis, a ultricies mi mollis blandit. Pellentesque a nunc at dui molestie sodales eu in turpis. Sed at arcu vitae urna maximus condimentum non id mi. Donec congue nulla at tellus tincidunt venenatis. Mauris tristique neque iaculis, dapibus tortor a, ultrices felis. Donec et leo dolor. Aliquam ac erat a lectus ultricies interdum eu et libero. Vestibulum mollis ex ac euismod tincidunt. Sed id viverra orci. Integer elementum congue orci. Nam vel ex dignissim, volutpat libero et, tempus libero. Curabitur laoreet hendrerit imperdiet. Praesent tincidunt iaculis diam eu tincidunt.
            ",
            "2020-04-05 09:14:46",
            "four-essential-eslint-plugin",
            1,
            "",
            "2020-04-05 09:14:46"
        )
`);
});
