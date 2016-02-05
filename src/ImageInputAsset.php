<?php
/**
 * Created by PhpStorm.
 * User: leviputna
 * Date: 4/02/2016
 * Time: 2:26 PM
 */

namespace consynki\yii\input;

use yii\web\AssetBundle;

class ImageInputAsset extends AssetBundle
{

    public $sourcePath = __DIR__ . '/assets';

    public $css = [
        'css/image-input.css'
    ];

    public $js = [
        'js/image-input.js'
    ];

    public $depends = [
        'yii\web\YiiAsset',
        'yii\bootstrap\BootstrapAsset',
    ];
}