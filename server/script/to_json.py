from json import dumps
from dataclasses import dataclass


@dataclass
class Student:
    no: str
    name: str
    className: str
    password: str


@dataclass
class Society:
    name: str
    cap: int


def students_txt_to_json():
    TXT_PATH = "./server/script/students.txt"
    JSON_PATH = "./server/script/students.json"

    # read txt

    with open(TXT_PATH, "r", encoding="utf-8") as f:
        students: list[Student] = []
        for line in f:
            if line.strip() == "":
                continue
            no, name, className, id_card = line.strip().split("\t")
            students.append(Student(no, name, className, f"{no[-6:]}@{id_card}"))

    # write json


    with open(JSON_PATH, "w", encoding="utf-8") as f:
        f.write(dumps([student.__dict__ for student in students], ensure_ascii=False, indent=2))

def society_txt_to_json():
    TXT_PATH = "./server/script/societies.txt"
    JSON_PATH = "./server/script/societies.json"

    # read txt

    with open(TXT_PATH, "r", encoding="utf-8") as f:
        societies: list[Society] = []
        for line in f:
            if line.strip() == "":
                continue
            name, cap = line.strip().split("\t")
            societies.append(Society(name, int(cap)))

    # write json

    with open(JSON_PATH, "w", encoding="utf-8") as f:
        f.write(dumps([society.__dict__ for society in societies], ensure_ascii=False, indent=2))


if __name__ == "__main__":
    students_txt_to_json()
    society_txt_to_json()

