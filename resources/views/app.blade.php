<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Laravel</title>
        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.jsx'])
        @inertiaHead
        <meta name="csrf-token" content="{{ csrf_token() }}"> 
          <link rel="icon" href="../assets/images/favicon/favicon.png" type="image/x-icon">
        <link rel="shortcut icon" href="../assets/images/favicon/favicon.png" type="image/x-icon">
        <link href="https://fonts.googleapis.com/css?family=Montserrat:400,500,600,700,800&amp;display=swap" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css?family=Roboto:400,500,600&amp;display=swap" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css?family=Rubik:300,300i,400,400i,500,500i,700,700i,900,900i&amp;display=swap" rel="stylesheet">
        <link rel="stylesheet" type="text/css" href="./assets/css/date-picker.css">
        <link rel="stylesheet" type="text/css" href="./assets/css/magnific-popup.css">
        <link rel="stylesheet" type="text/css" href="./assets/css/style.css" media="screen" id="color">
        <link rel="stylesheet" type="text/css" href="./assets/css/themify-icons.css">
        <link rel="stylesheet" type="text/css" href="./assets/css/tour.css">
        <link rel="stylesheet" type="text/css" href="./assets/js/ckeditor/skins/moono-lisa/editor.css?t=HBDD">
        <link rel="stylesheet" type="text/css" href="./assets/js/ckeditor/plugins/scayt/skins/moono-lisa/scayt.css">
        <link rel="stylesheet" type="text/css" href="./assets/js/ckeditor/plugins/scayt/dialogs/dialog.css">
        <link rel="stylesheet" type="text/css" href="./assets/js/ckeditor/plugins/tableselection/styles/tableselection.css">
        <link rel="stylesheet" type="text/css" href="./assets/js/ckeditor/plugins/wsc/skins/moono-lisa/wsc.css">
        <link rel="stylesheet" type="text/css" href="./assets/js/ckeditor/plugins/copyformatting/styles/copyformatting.css">
        {{-- <script src="{{ asset('ckeditor/ckeditor.js') }}"></script> --}}
    </head>
    <body>
        @inertia
        <script>
            const csrfToken = document.head.querySelector('meta[name="csrf-token"]').content;
        </script>
    </body>
</html>