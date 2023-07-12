import shell from "shelljs";

shell.mkdir("-p", "dist/public/ejs");
shell.cp( "-R", "src/public/ejs", "dist/public/" );

shell.mkdir("-p", "dist/public/css");
shell.cp( "-R", "src/public/css", "dist/public/" );

shell.mkdir("-p", "dist/public/js/bootstrap");
shell.cp( "-R", "src/public/js/bootstrap", "dist/public/js" );

shell.mkdir("-p", "dist/public/js/jquery");
shell.cp( "-R", "src/public/js/jquery", "dist/public/js" );

shell.cp( "src/public/favicon.ico", "dist/public/" );
