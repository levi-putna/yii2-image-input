<?php
    /**
     * Created by PhpStorm.
     * User: leviputna
     * Date: 4/02/2016
     * Time: 2:26 PM
     */

    namespace consynki\yii\input;

    use yii\web\AssetBundle;

    class ImageInputAsset extends AssetBundle {

        public $css = [
            'css/main.css'
        ];

        public $js = [
            'js/main.js'
        ];

        public $depends = [
            'yii\web\YiiAsset',
            'yii\bootstrap\BootstrapAsset',
        ];

        public function init() {
            parent::init();

            $this->sourcePath = __DIR__ . '/assets';
        }
    }