<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?php echo $Test->getTitle(); log_message_prod($Test->getTitle());?></title>

<?php echo $this->load->view("analytics_tracking_php.dev.php", true);?>

<?php
    $cssFilesPath = $Test->cssFilesPath;
    foreach($cssFilesPath as $index => $value){
        echo '<link rel="stylesheet" href="'.$value.'">';
    }
    $jsFilesPath = $Test->jsFilesPath;
    foreach($jsFilesPath as $index => $value){
?>
<script type="text/javascript" src="<?php echo $value; ?>"></script>
<?php } ?>
</head>
<body>
	<div class="wrap-div"><?php if($Test->isValidId){
		include($Test->htmlFilePath);
	}else{
		include_once("links.html");
	} ?></div>
</body>
</html>