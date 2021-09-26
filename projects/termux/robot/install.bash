function ensure_bashrc(){
    if test -z "$(find ~ -name '.bashrc')";then
	echo "Not exist ~/.bashrc";
	echo "Creating ~/.bashrc";
	echo "" > ~/.bashrc;
    fi
    echo "Existed ~/.bashrc";
}
function ensure_reference_index_bash(){
    if test -z "$(grep 'bash ~/.termux-robot/index.bash' ~/.bashrc)";then
	echo "Not Install reference in ~/.bashrc";
	echo "Installing reference in ~/.bashrc";
	echo "bash ~/.termux-robot/index.bash" >> ~/.bashrc;
    fi
    echo "Installed reference in ~/.bashrc";
}
function ensure_directory(){
    if test -z "$(find ~/.termux-robot)";then
	echo "Not exist ~/.termux-robot";
	echo "Creating ~/.termux-robot";
	mkdir ~/.termux-robot;
    fi    
}
function download_latest_index_bash(){
    echo "Downloading ~/.termux-robot/index.bash";
    curl https://gitee.com/sundawning/sundawning.gitee.io/raw/master/projects/termux/robot/index.bash -o ~/.termux-robot/index.bash
    echo "Downloading ~/.termux-robot/index.js";
    curl https://gitee.com/sundawning/sundawning.gitee.io/raw/master/projects/termux/robot/index.js -o ~/.termux-robot/index.js
}
function index(){
    ensure_bashrc;
    ensure_reference_index_bash;
    ensure_directory;
    download_latest_index_bash;
    bash ./index.bash;
}
cd ~/.termux-robot;
index;
