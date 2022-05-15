*Postman for using these APIs*

Express JS APIs for below requirements: 
1) Create upload storage token
	URL : http://localhost:8080/create_new_storage
   	Method  : POST
    	Response Body    (json)
	{
   		 "status": "ok",
   		 "message": "Storage Created Successfully"
	}
 	Description : It is used to Create token  and store that token in client side (browser) 
		   so that all uploaded file from this users can be identified  using this token . 

2) Upload file ( file can be Image , Text, Audio, Video
	URL : http://localhost:8080/upload_file
   	Method  : POST
    	Response Body    (json)
	{
   		 "status": "ok",
   		 "message": file path
	}
 	Description : Used to upload Image file ( jpg, jpeg, png) , Text file ( txt) , 
			Video file ( mp4) . You will have to send your  file using formData with key 'my_file'  . 

3) Access uploaded file
	URL : http://localhost:8080/{file path} #here the code match url for folder 'uploads/{file name}'
   	Method  : GET
    	Response Body    (json)
	{
   		 "status": "ok",
   		 "message": file path
	}
 	Description : Access uploaded Image file ( jpg, jpeg, png) , Text file ( txt) , 
			Video file ( mp4) . 

4) Create Audio  
	URL : http://localhost:8080//text_file_to_audio # "uploads" direc
   	Method  : POST
	Request body
 	 {
    		"file_path": "public/upload/6bc5277a-b3ac-477e-b71d-998c156bc0da.txt"
       }

    	Response Body    (json)
	 {
	    "status":"ok",
	    "message": "text to speech converted",
   	    "audio_file_path": "public/audio/4839379a-4d0a-440e-943f-e1e4b0ebfdb7.mp3"
	 }

 	Description : Used to convert audio from uploaded text file .  In Request body 'file_path' is the uploaded text file path . 
			In Response body 'audio_file_path' is the path of converted audio file .  

5) Merge Image + Audio  to create video
	URL : http://localhost:8080//merge_image_and_audio 
   	Method  : POST
	Request body
 	 {
    		"file_path": "public/upload/6bc5277a-b3ac-477e-b71d-998c156bc0da.txt"
       }

    	Response Body    (json)
	 {
	    "status":"ok",
	    "message": "Video Created Successfully",
   	    "video_file_path": __dirname+/4839379a-4d0a-440e-943f-e1e4b0ebfdb7.mp4"
	 }

 	Description : Used to   Create Video by merging Image and Audio. In Request body 
		'image_file_path' is the path of uploaded Image file , 'audio_file_path' ' is the 
		path of uploaded Audio file. In Response body 'video_file_path' is the path of output video 
		file.
 
6) Merge Video + Audio to create video 
	URL : http://localhost:8080/merge_all_video
   	Method  : POST
	Request body
  	 {
   		"video_file_path":"public/upload/893adf65-9c49-4d74-9add-36ca23c6361c.mp4", 
   		 "video_file_path": "public/upload/4839379a-4d0a-440e-943f-e1e4b0ebfdb7.mp4"
  	 }


    	Response Body    (json)
	 {
	    "status":"ok",
	    "message": "Video Created Successfully",
   	    "video_file_path": __dirname+/4839379a-4d0a-440e-943f-e1e4b0ebfdb7.mp4"
	 }

 	Description :Used to   Create Video by Replacing  Audio in video with given Audio . In Request body 'video_file_path' is the path of uploaded video file , 'audio_file_path' ' is the path of uploaded Audio file. 
		In Response body 'video_file_path' is the path of output video file.

7) Merge all video
	URL : http://localhost:8080/merge_video_and_audio
   	Method  : POST
	Request body
  	 {
   		"video_file_path":"public/upload/893adf65-9c49-4d74-9add-36ca23c6361c.mp4", 
   		 "audio_file_path": "public/upload/4839379a-4d0a-440e-943f-e1e4b0ebfdb7.mp3"
  	 }


    	Response Body    (json)
	 {
	    "status":"ok",
	    "message": "Video Created Successfully",
   	    "video_file_path": __dirname+/4839379a-4d0a-440e-943f-e1e4b0ebfdb7.mp4"
	 }

 	Description :Used to   merge  multiple  videos  . In Request body 
		'video_file_path_list' is the array contain the list of video file path . Video will be merge 
		according to the index  of video files in  'video_file_path_list' . In Response body 
		'video_file_path' is the path of output video file. 

8) Download a file
   	URL : http://localhost:8080/download_file
   	Method  : GET
   	Request Query   (query-string)
    	 file_path=public/upload/5214c459-47d5-434f-8c25-cce3a5f47ff7.mp4
 
   	Response 
         will load the file as response

	Description : Used to    download  existing file from server . if you want to download any    existing      file 
		from server then  you can send get request to the server and it will download the fil

9) List all uploaded file
 	URL : http://localhost:8080/my_upload_file
   	Method  : GET
	Response 
	 {
   		 "status": "ok",
   		 "data": [
     		   "9c5ff995-23c0-418a-8ed4-a5da9c10fd37-10fcfc4e-fa8e-404a-bfdd-422f68beb2a2.png",
        	   "9c5ff995-23c0-418a-8ed4-a5da9c10fd37-f8b34592-3c46-456d-9d86-26de6e6daa35.txt"
    			]
	}
	Description : Used to List All uploaded files by user. 'data' field contain the array of all uploaded 
	file paths.

