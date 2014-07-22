move logging.txt logging.previous.txt
VoteCounter.exe areacodetable.csv C:\Users\HT4N\Documents\GitHub\Pilpres2014Portal 16 > logging.txt
TotalTrendAggregator.exe C:\Users\HT4N\Documents\GitHub\Pilpres2014Portal C:\Users\HT4N\Documents\GitHub\Pilpres2014Portal\totaltrend.tsv
FeedsMetadataGenerator.exe C:\Users\HT4N\Documents\GitHub\Pilpres2014Portal C:\Users\HT4N\Documents\GitHub\Pilpres2014Portal\feedsources.json

VisualizeEverything.exe C:\Users\HT4N\Documents\GitHub\Pilpres2014Portal C:\Users\HT4N\Documents\GitHub\Pilpres2014Portal\pilpres2014.json Province
VisualizeEverything.exe C:\Users\HT4N\Documents\GitHub\Pilpres2014Portal C:\Users\HT4N\Documents\GitHub\Pilpres2014Portal\midpilpres2014.json Kabupaten
VisualizeEverything.exe C:\Users\HT4N\Documents\GitHub\Pilpres2014Portal C:\Users\HT4N\Documents\GitHub\Pilpres2014Portal\fullpilpres2014.json Kecamatan

pushd C:\Users\HT4N\Documents\GitHub\Pilpres2014Portal
git add KPU-Feeds* >> logging.txt
git add totaltrend.tsv >> logging.txt
git add pilpres2014.json >> logging.txt
git add midpilpres2014.json >> logging.txt
git add fullpilpres2014.json >> logging.txt
git add feedsources.json  >> logging.txt
git commit -m "new data"  >> logging.txt
REM git push  >> logging.txt
popd