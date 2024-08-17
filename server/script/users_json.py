from json import dumps
from dataclasses import dataclass


@dataclass
class Student:
    no: str
    name: str


def students_txt_to_json():
    TXT_PATH = "./server/script/students.txt"
    JSON_PATH = "./server/script/students.json"

    # read txt

    with open(TXT_PATH, "r", encoding="utf-8") as f:
        students: list[Student] = []
        for line in f:
            if line.strip() == "":
                continue
            no, name = line.strip().split("\t")
            students.append(Student(no, name))

    # write json


    with open(JSON_PATH, "w", encoding="utf-8") as f:
        f.write(dumps([student.__dict__ for student in students], ensure_ascii=False, indent=2))


if __name__ == "__main__":
    students_txt_to_json()

