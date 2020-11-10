# an engin cocoscreator

# cocoscreator with engin

A basic game framework of chess and cards
Welcome to submit issues
I will merge into the main branch regularly

You need to combine the cc_own with my attachment customize some configurations。
If you have any questions, please email me directly and I will reply you at any time

# without

1. scripts/libs/typestate/typestate.ts
2. scripts\libs\utils\PositionExtension.ts
3. scripts/libs/utils/StringExtension.ts
4. GodGuide

# first use

1. git submodule init
2. git submodule update --remote --merge 直接在主仓库里抓取与合并子模块
3. git rm -r --cached assets/
4. git submodule add https://github.com/jackdevelop/cc_engin.git assets/cc_engin

# user

submodule 远程分支发生变更后，直接使用 git submodule update 是不会进行更新操作的

1. git submodule foreach git checkout master
2. git submodule foreach git pull
