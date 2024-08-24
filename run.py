from sys import argv, stdout, stderr
from os import environ
from pathlib import Path
from time import sleep
from subprocess import Popen
from typing import Union, Optional
from argparse import ArgumentParser
from shutil import which

ROOT = Path(argv[0]).absolute().parent


def general_popen(
    *cmd: Union[str, Path], cwd: Path = ROOT, env_add: Optional[dict[str, str]] = None
):
    if env_add is None:
        env_add = {}
    new_env = environ.copy()
    new_env.update(env_add)
    return Popen(
        [str(c) for c in cmd], cwd=str(cwd), stdout=stdout, stderr=stderr, env=new_env
    )


def init_database():
    return general_popen("node", ROOT / "server/dist/script/database_init.mjs")


def build_ts():
    tsc = which("tsc")
    assert tsc is not None, "TypeScript compiler not found"
    return general_popen(tsc, cwd=ROOT / "server")


def build_client():
    pnpm = which("pnpm")
    assert pnpm is not None, "PNPM not found"
    return general_popen(pnpm, "run", "build", cwd=ROOT / "client")


def run_pocket_base():
    return general_popen(ROOT / "pocketbase.exe", "serve")


def all_wait(*wait_list: Popen[bytes]):
    for p in wait_list:
        code = p.wait()
        if code != 0:
            raise ChildProcessError(f"Process {p.args} exited with code {code}")


def run_express_server(node_env: str = "development"):
    pocket_base = run_pocket_base()
    if node_env == "production":
        build_client().wait()
    build_ts().wait()
    sleep(1) # To make sure pocket base is ready to serve
    return (
        pocket_base,
        general_popen(
            "node", ROOT / "server" / "dist" / "main.mjs", env_add={"NODE_ENV": node_env}
        ),
    )


def main():
    parser = ArgumentParser()
    parser.add_argument(
        "--init-database", action="store_true", help="Initialize the database"
    )
    parser.add_argument(
        "--production", "--prod", action="store_true", help="Run in production mode"
    )

    args = parser.parse_args()

    if args.init_database:
        build_ts().wait()
        init_database().wait()
    else:
        pocket_base, express_server = run_express_server(
            "production" if args.production else "development"
        )
        try:
            all_wait(pocket_base, express_server)
        except KeyboardInterrupt:
            pass
        finally:
            pocket_base.terminate()
            express_server.terminate()


if __name__ == "__main__":
    main()
