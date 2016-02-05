Yii2 Image Input Field
=================

This extension provides a drag drop image field to inclusion within a standard Yii2 form. This extension dosn't provide any functionality for uploading the images, that can be done via the standard Yii form processing.

## Installation

The preferred way to install this extension is through [composer](http://getcomposer.org/download/). 

To install, either run

```$ composer require consynki/yii2-image-input "*"
```

or add

```"consynki/yii2-image-input": "*"
```

to the
```require```
section of your `composer.json` file.

## Usage

### Alert

You can use the image input in a standard Yii form.

```php
<?php

    use consynki\yii\input\ImageInput;
    use yii\helpers\Html;
    use yii\widgets\ActiveForm;

?>

	<?php $form = ActiveForm::begin(); ?>

	<?= $form->field($model, 'image')->widget(ImageInput::className(), [
		'value' => '/img/current-image.png' //Optional current value
    ]); ?>

<?= Html::submitButton('Save', []) ?>

<?php ActiveForm::end(); ?>
```

You can pass in the optional `value` to display a default image as the current value of the field.